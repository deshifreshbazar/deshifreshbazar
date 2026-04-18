import { notFound } from 'next/navigation';
import RootLayout from "@/components/layout/RootLayout";
import ProductClient from "./ProductClient";
import { prisma } from '@/lib/prisma';

export const revalidate = 300;

async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        details: true,
        price: true,
        image: true,
        stock: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        packages: {
          select: {
            id: true,
            name: true,
            price: true,
            productId: true,
          },
        },
      }
    });
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        NOT: {
          id: currentProductId
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 4,
      select: {
        id: true,
        name: true,
        description: true,
        details: true,
        price: true,
        image: true,
        stock: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        packages: {
          select: {
            id: true,
            name: true,
            price: true,
            productId: true,
          },
        },
      }
    });
    return products;
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  
  if (!product) {
    notFound();
  }

  // Ensure product.details is a string (convert null to empty string)
  const productWithStringDetails = {
    ...product,
    details: product.details || ''
  };

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);
  
  // Ensure all related products have string details
  const relatedProductsWithStringDetails = relatedProducts.map(p => ({
    ...p,
    details: p.details || ''
  }));

  return (
    <RootLayout>
      <ProductClient product={productWithStringDetails} products={relatedProductsWithStringDetails} />
    </RootLayout>
  );
}
