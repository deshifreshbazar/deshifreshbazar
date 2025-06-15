'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import React from 'react';
import { FaBoxOpen, FaShoppingCart, FaUsers, FaChartBar, FaFileExport, FaCalendarAlt } from 'react-icons/fa';
import { Loader } from '@/components/ui/loader';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';

interface OrderItem {
  id: string;
  productName: string;
  productImage?: string;
  packageType?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

const ORDER_STATUSES = [
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
];

function getPaginationRange(current: number, total: number, delta = 2) {
  const range: (number | string)[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);

  if (left > 2) range.push('...');

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < total - 1) range.push('...');

  if (total > 1) range.push(total);

  return range;
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportAllOrders, setExportAllOrders] = useState(false);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        search: search,
        status: statusFilter,
        sort: sortOrder,
      });
      const response = await fetch(`/api/admin/orders?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [page, search, statusFilter, sortOrder]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      fetchOrders();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const handleCancel = (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel?')) {
      handleStatusChange(orderId, 'CANCELLED');
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      
      // Add date range parameters to export URL
      const params = new URLSearchParams();
      if (!exportAllOrders) {
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
      }
      
      const response = await fetch(`/api/admin/orders/export?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = 'orders.xlsx';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
      
      toast.success('Orders exported successfully');
      setExportDialogOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export orders');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }
  if (error) return <div className="text-red-500">{error}</div>;

  const noOrders = !orders || orders.length === 0;

  return (
    <>
      {/* Mobile Order List */}
      <div className="block md:hidden bg-[#fcfdff] min-h-screen pb-24">
        <div className="flex justify-between items-center px-4 py-4">
          <h1 className="text-2xl font-bold">Orders</h1>
          <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="flex items-center gap-2"
                disabled={noOrders}
              >
                <FaFileExport className="w-4 h-4" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Export Orders</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="export-all-mobile"
                    checked={exportAllOrders}
                    onChange={(e) => setExportAllOrders(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <label htmlFor="export-all-mobile" className="text-sm font-medium text-gray-700">
                    Export all orders (ignore date range)
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Date</label>
                  <Input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">To Date</label>
                  <Input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  onClick={handleExport}
                  disabled={exporting}
                  className="flex items-center gap-2"
                >
                  {exporting ? 'Exporting...' : 'Export'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
          <div className="px-4 mb-4 flex flex-col gap-3">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search orders..."
                className="w-full pl-10 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={v => setStatusFilter(v === 'ALL' ? '' : v)}>
                <SelectTrigger className="min-w-[100px] rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                  <SelectItem value="ALL" className="hover:bg-blue-50 cursor-pointer">All</SelectItem>
                  {ORDER_STATUSES.map(status => (
                    <SelectItem 
                      key={status} 
                      value={status}
                      className="hover:bg-blue-50 cursor-pointer"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={v => setSortOrder(v as 'desc' | 'asc')}>
                <SelectTrigger className="min-w-[100px] rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                  <SelectItem value="desc" className="hover:bg-blue-50 cursor-pointer">Newest</SelectItem>
                  <SelectItem value="asc" className="hover:bg-blue-50 cursor-pointer">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        {loading ? (
          <div className="flex justify-center items-center py-8">Loading...</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded m-4">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        ) : noOrders ? (
          <div className="text-center text-gray-500 py-16 text-lg">No orders found</div>
        ) : (
          <div className="flex flex-col gap-3 px-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow border p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-base text-gray-900">{order.customerName}</div>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{order.status}</span>
                </div>
                {/* Status update select for mobile */}
                <div className="my-2">
                  <Select
                    value={order.status}
                    onValueChange={v => handleStatusChange(order.id, v)}
                    disabled={order.status === 'CANCELLED'}
                  >
                    <SelectTrigger className="w-full min-w-[100px] rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-xs h-9">
                      <SelectValue>{order.status}</SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                      {ORDER_STATUSES.map(status => (
                        <SelectItem key={status} value={status} className="hover:bg-blue-50 cursor-pointer text-xs">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-xs text-gray-500 mb-1">Order ID: {order.id}</div>
                <div className="text-xs text-gray-500 mb-1">৳{order.totalAmount} • {new Date(order.createdAt).toISOString().slice(0, 10)}</div>
                <div className="text-xs text-gray-500 mb-1">{order.shippingAddress}, {order.shippingCity}</div>
                <div className="flex gap-10 mt-2">
                  <button
                    onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                    className="text-blue-600 text-xs font-medium"
                  >
                    {expandedOrderId === order.id ? 'Hide' : 'View'}
                  </button>
                  <button
                    onClick={() => handleCancel(order.id)}
                    className="text-red-600 text-xs font-medium"
                    disabled={order.status === 'CANCELLED'}
                  >
                    Cancel
                  </button>
                </div>
                {expandedOrderId === order.id && (
                  <div className="mt-3 border-t pt-2">
                    <div className="font-semibold mb-1 text-sm">Order Items</div>
                    <ul className="divide-y divide-gray-100">
                      {order.items.map(item => (
                        <li key={item.id} className="flex items-center gap-2 py-1">
                          {item.productImage ? (
                            <img src={item.productImage} alt={item.productName} className="w-10 h-10 object-cover rounded" />
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                          <div className="flex-1">
                            <div className="text-xs font-medium text-gray-900">{item.productName}</div>
                            <div className="text-xs text-gray-500">Qty: {item.quantity} • ৳{item.unitPrice}</div>
                          </div>
                          <div className="text-xs text-gray-500">{item.packageType || '-'}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
      <div className="hidden md:block">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <h1 className="text-2xl font-bold text-center">Customer Orders List</h1>
            <div className="flex flex-wrap gap-2 items-center">
              <Input
                type="search"
                placeholder="Search orders..."
                className="max-w-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Select value={statusFilter} onValueChange={v => setStatusFilter(v === 'ALL' ? '' : v)}>
                <SelectTrigger className="min-w-[120px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  {ORDER_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={v => setSortOrder(v as 'desc' | 'asc')}>
                <SelectTrigger className="min-w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="flex items-center gap-2"
                    disabled={noOrders}
                  >
                    <FaFileExport className="w-4 h-4" />
                    Export Orders
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Export Orders</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="export-all-desktop"
                        checked={exportAllOrders}
                        onChange={(e) => setExportAllOrders(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <label htmlFor="export-all-desktop" className="text-sm font-medium text-gray-700">
                        Export all orders
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">From Date</label>
                      <Input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)}
                        disabled={exportAllOrders}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">To Date</label>
                      <Input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)}
                        disabled={exportAllOrders}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button 
                      onClick={handleExport}
                      disabled={exporting}
                      className="flex items-center gap-2"
                    >
                      {exporting ? 'Exporting...' : 'Export'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {noOrders ? (
            <div className="text-center text-gray-500 py-16 text-lg">No orders found</div>
          ) : (
            <div className="w-full overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="py-4 px-4 text-left text-sm font-medium text-gray-600">Order ID</th>
                    <th className="py-4 px-4 text-left text-sm font-medium text-gray-600">Customer Name</th>
                    <th className="py-4 px-4 text-left text-sm font-medium text-gray-600">Phone</th>
                    <th className="py-4 px-4 text-left text-sm font-medium text-gray-600">Shipping Address</th>
                    <th className="py-4 px-4 text-left text-sm font-medium text-gray-600">Order Date</th>
                    <th className="py-4 px-4 text-left text-sm font-medium text-gray-600">Total Amount</th>
                    <th className="py-4 px-4 text-left text-sm font-medium text-gray-600">Payment Method</th>
                    <th className="py-4 px-4 text-left text-sm font-medium text-gray-600">Email</th>
                    <th className="py-4 px-4 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="py-4 px-4 text-left text-sm font-medium text-gray-600">Details</th>
                    <th className="py-4 px-4 text-left text-sm font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="py-4 px-4 text-sm text-gray-900">{order.id}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{order.customerName}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{order.customerPhone}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{order.shippingAddress}, {order.shippingCity}, {order.shippingPostalCode}, {order.shippingCountry}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{new Date(order.createdAt).toISOString().slice(0, 10)}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">৳{order.totalAmount}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{order.paymentMethod}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{order.customerEmail}</td>
                        <td className="py-4 px-4">
                          <Select
                            value={order.status}
                            onValueChange={v => handleStatusChange(order.id, v)}
                            disabled={order.status === 'CANCELLED'}
                          >
                            <SelectTrigger className="min-w-[120px]">
                              <SelectValue>{order.status}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {ORDER_STATUSES.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-4 px-4">
                          <Button size="sm" variant="outline" onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}>
                            {expandedOrderId === order.id ? 'Hide' : 'View'}
                          </Button>
                        </td>
                        <td className="py-4 px-4">
                          {order.status === 'CANCELLED' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(order.id, 'PENDING')}
                            >
                              Restore
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancel(order.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </td>
                      </tr>
                      {expandedOrderId === order.id && (
                        <tr>
                          <td colSpan={11} className="bg-gray-50 border-t border-b border-gray-200">
                            <div className="p-6">
                              <h3 className="font-semibold mb-4 text-gray-900">Order Items</h3>
                              <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="w-full">
                                  <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Product Image</th>
                                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Product Name</th>
                                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Package Type</th>
                                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Unit Price</th>
                                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Quantity</th>
                                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Total Price</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {order.items.map((item) => (
                                      <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="py-3 px-4">
                                          {item.productImage ? (
                                            <img src={item.productImage} alt={item.productName} className="w-16 h-16 object-cover rounded-lg" />
                                          ) : (
                                            <span className="text-gray-400">No image</span>
                                          )}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-900">{item.productName}</td>
                                        <td className="py-3 px-4 text-sm text-gray-900">{item.packageType || '-'}</td>
                                        <td className="py-3 px-4 text-sm text-gray-900">৳{item.unitPrice}</td>
                                        <td className="py-3 px-4 text-sm text-gray-900">{item.quantity}</td>
                                        <td className="py-3 px-4 text-sm text-gray-900">৳{item.totalPrice}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-center items-center gap-1 mt-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPage(1)}
              disabled={page === 1}
              aria-label="First"
            >
              &#124;&lt;
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous"
            >
              &lt;
            </Button>
            {getPaginationRange(page, totalPages).map((p, idx) =>
              typeof p === 'number' ? (
                <Button
                  key={p}
                  size="sm"
                  variant={p === page ? "secondary" : "ghost"}
                  onClick={() => setPage(p)}
                  className={p === page ? "font-bold" : ""}
                >
                  {p}
                </Button>
              ) : (
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
              )
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next"
            >
              &gt;
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              aria-label="Last"
            >
              &gt;&#124;
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}