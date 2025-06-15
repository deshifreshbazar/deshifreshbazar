'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import RootLayout from "@/components/layout/RootLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";

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

export default function FruitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <RootLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader size="lg" />
        </div>
      </RootLayout>
    );
  }

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

  const categories = Array.from(
    new Set(products.map((product) => product.category.name))
  );

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
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="font-medium text-green-700">৳ {product.price}</p>
                    <Button asChild size="sm" className="bg-green-700 hover:bg-green-800">
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
