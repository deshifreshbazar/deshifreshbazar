'use client';

import { memo, useEffect, useMemo, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import RootLayout from "@/components/layout/RootLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: {
    name: string;
  };
}

const ProductSkeleton = memo(function ProductSkeleton() {
  return (
    <div className="h-full rounded-lg border border-gray-100 bg-white p-3">
      <div className="aspect-square rounded-md bg-gray-100" />
      <div className="mt-3 h-4 w-4/5 rounded bg-gray-100" />
      <div className="mt-2 h-3 w-2/3 rounded bg-gray-100" />
      <div className="mt-4 h-8 w-full rounded bg-gray-100" />
    </div>
  );
});

export default function FruitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const skeletonItems = useMemo(() => [0, 1, 2, 3], []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category.name))),
    [products],
  );

  if (error) {
    return (
      <RootLayout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-4">{error}</p>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div className="bg-gray-50 py-8">
        <div className="container">
          <h1 className="mb-8 text-3xl font-bold">All Fruits</h1>

          {/* Category filter */}
          <div className="mb-8 flex flex-wrap gap-2">
            <Button variant="outline" className="bg-white">
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                className="bg-white"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {loading
              ? skeletonItems.map((item) => <ProductSkeleton key={item} />)
              : products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={600}
                        height={600}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="font-medium text-green-700">৳ {product.price}</p>
                        <Button
                          asChild
                          size="sm"
                          className="bg-green-700 hover:bg-green-800"
                        >
                          <Link href={`/product/${product.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
