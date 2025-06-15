"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import RootLayout from "@/components/layout/RootLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { 
    items, 
    updateQuantity, 
    updatePackage, 
    removeItem, 
    getItemPrice,
    getCartTotal,
    getCartCount,
    clearCart 
  } = useCart();

  const calculateShipping = () => {
    const subtotal = getCartTotal();
    if (subtotal === 0) return 0;
    return subtotal > 5000 ? 0 : 100;
  };

  const calculateTotal = () => {
    return getCartTotal() + calculateShipping();
  };

  return (
    <RootLayout>
      <div className="bg-gray-50 py-8">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            {items.length > 0 && (
              <Button 
                variant="outline" 
                onClick={clearCart}
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                Clear Cart
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center">
              <p className="mb-4 text-lg">Your cart is empty</p>
              <Button asChild className="bg-green-700 hover:bg-green-800">
                <Link href="/fruits">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="rounded-lg bg-white">
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Cart Items ({getCartCount()})</h2>
                    </div>
                    <div className="divide-y">
                      {items.map((item) => (
                        <div key={`${item.id}-${item.selectedPackage}`} className="py-4 flex flex-wrap items-center gap-4">
                          <div className="w-16 h-16 overflow-hidden rounded">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-grow min-w-[200px]">
                            <Link
                              href={`/product/${item.id}`}
                              className="font-medium hover:text-green-700"
                            >
                              {item.name}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                            <div className="mt-2 flex gap-2">
                              {item.packages.map(pkg => (
                                <button
                                  key={pkg.id}
                                  onClick={() => updatePackage(item.id, pkg.id)}
                                  className={`px-3 py-1 rounded text-sm ${
                                    item.selectedPackage === pkg.id 
                                      ? 'bg-green-700 text-white' 
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  {pkg.name} - ৳{pkg.price}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 rounded-l-md rounded-r-none"
                                disabled={item.quantity <= 1}
                              >
                                -
                              </Button>
                              <div className="flex h-8 w-12 items-center justify-center border border-x-0 border-input">
                                {item.quantity}
                              </div>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 rounded-l-none rounded-r-md"
                              >
                                +
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="h-8 w-8 text-red-500 hover:bg-red-50"
                              title="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="font-semibold ml-auto text-right min-w-[100px]">
                            <div className="text-sm text-muted-foreground">
                              ৳{getItemPrice(item)} × {item.quantity}
                            </div>
                            <div>৳{item.totalPrice}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>৳{getCartTotal()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>
                          {calculateShipping() === 0
                            ? "Free"
                            : `৳${calculateShipping()}`}
                        </span>
                      </div>
                      <div className="border-t pt-3 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>৳{calculateTotal()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full bg-green-700 hover:bg-green-800">
                      <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <div className="mt-4 text-center">
                  <Link
                    href="/fruits"
                    className="text-sm text-muted-foreground hover:text-green-700"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </RootLayout>
  );
}
