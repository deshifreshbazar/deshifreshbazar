'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@prisma/client';
import { FaBoxOpen, FaShoppingCart, FaUsers, FaChartBar, FaGripVertical } from 'react-icons/fa';
import { Loader } from '@/components/ui/loader';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
}

interface ProductWithCategory extends Product {
  category: Category;
  packages: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/products?page=${page}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data.products)) {
        throw new Error('Invalid data format received');
      }
      
      // Sort products by sequence
      const sortedProducts = [...data.products].sort((a, b) => a.sequence - b.sequence);
      setProducts(sortedProducts);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error instanceof Error ? error.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(product => product.id !== productId));
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(error instanceof Error ? error.message : 'Error deleting product');
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update sequences
    const updatedItems = items.map((item, index) => ({
      ...item,
      sequence: index,
    }));

    // Optimistically update UI
    setProducts(updatedItems);

    try {
      const response = await fetch('/api/admin/products/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: updatedItems.map(item => ({
            id: item.id,
            sequence: item.sequence,
          })),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product sequence');
      }
    } catch (error) {
      console.error('Error updating product sequence:', error);
      // Revert the optimistic update
      setProducts(items);
      // Show error message
      if (error instanceof Error && error.message.includes('Not authenticated')) {
        alert('Please log in again to continue.');
        router.push('/login');
        return;
      }
      alert(error instanceof Error ? error.message : 'Failed to update product sequence. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error</p>
          <p>{error}</p>
          <button
            onClick={() => fetchProducts(page)}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <Link
            href="/admin/products/add"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add New Product
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">No products found</p>
          <Link
            href="/admin/products/add"
            className="text-green-600 hover:text-green-700 underline"
          >
            Add your first product
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {/* Mobile Product List */}
      <div className="block md:hidden bg-[#fcfdff] min-h-screen pb-24">
        <div className="flex justify-between items-center px-4 py-4">
          <h1 className="text-2xl font-bold">Products</h1>
          <Link
            href="/admin/products/add"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
          >
            Add
          </Link>
        </div>
        <Droppable droppableId="products-mobile">
          {(provided: DroppableProvided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col gap-3 px-4"
            >
              {products.map((product, index) => (
                <Draggable key={product.id} draggableId={product.id} index={index}>
                  {(provided: DraggableProvided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white rounded-xl shadow border p-4 flex items-center gap-4"
                    >
                      <div {...provided.dragHandleProps} className="cursor-move">
                        <FaGripVertical className="text-gray-400" />
                      </div>
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <div className="font-semibold text-base text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.category?.name || 'Uncategorized'}</div>
                        <div className="text-xs text-gray-500">৳{product.price.toFixed(2)} | Stock: {product.stock}</div>
                      </div>
                      <button
                        onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                        className="text-indigo-600 text-xs font-medium mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-6">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      {/* Desktop Table */}
      <div className="hidden md:block p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <Link
            href="/admin/products/add"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add New Product
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Droppable droppableId="products-desktop">
            {(provided) => (
              <table className="min-w-full divide-y divide-gray-200" {...provided.droppableProps} ref={provided.innerRef}>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-8"></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product, index) => (
                    <Draggable key={product.id} draggableId={product.id} index={index}>
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <td className="pl-4" {...provided.dragHandleProps}>
                            <FaGripVertical className="text-gray-400 cursor-move" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={product.image}
                                  alt={product.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500">{product.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">৳{product.price.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.stock}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.category?.name || 'Uncategorized'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
          <div className="flex justify-between items-center p-4 border-t">
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
} 