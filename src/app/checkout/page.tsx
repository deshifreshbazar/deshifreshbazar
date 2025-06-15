"use client";

// For static site generation
export const dynamic = 'force-static';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RootLayout from "@/components/layout/RootLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useCart } from '@/contexts/CartContext';

interface OrderFormData {
  fullName: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// Update the imports and interfaces to match the database schema
interface CartItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  totalPrice: number;
  selectedPackage: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("SSLCommerz");
  const [loading, setLoading] = useState(false);
  const { items, getCartTotal, getItemPrice } = useCart();
  const [agreed, setAgreed] = useState(false);

  const form = useForm<OrderFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "Bangladesh",
    },
  });

  const calculateSubtotal = () => {
    return getCartTotal();
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    if (subtotal === 0) return 0;
    return subtotal > 5000 ? 0 : 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const onSubmit = async (data: OrderFormData) => {
    try {
      setLoading(true);

      const orderData = {
        ...data,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: getItemPrice(item),
          totalPrice: item.totalPrice,
          selectedPackage: item.selectedPackage,
        })),
        subtotal: calculateSubtotal(),
        shipping: calculateShipping(),
        total: calculateTotal(),
        paymentMethod,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create order');
      }

      const order = await response.json();
      
      // Clear cart after successful order
      // You'll need to implement this in your CartContext
      // clearCart();

      // Redirect to success page with order ID
      const queryParams = new URLSearchParams({
        orderId: order.id,
        fullName: data.fullName,
        email: data.email || "",
        phone: data.phone,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
      }).toString();
      
      router.push(`/checkout/success?${queryParams}`);
    } catch (error: unknown) {
      console.error('Order creation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RootLayout>
      <div className="bg-gray-50 py-8">
        <div className="container">
          <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div>
                        <h2 className="mb-4 text-xl font-semibold">Contact Information</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                  <Input placeholder="Your name" required {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="xxx@gmail.com"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                  <Input
                                    type="tel"
                                    pattern="[0-9]{11}"
                                    maxLength={11}
                                    placeholder="018XXXXXXXX"
                                    required
                                    {...field}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^0-9]/g, '');
                                      if (value.length <= 11) {
                                        field.onChange(value);
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div>
                        <h2 className="mb-4 text-xl font-semibold">Shipping Address</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="md:col-span-2">
                            <FormField
                              control={form.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Address <span className="text-red-500">*</span></FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="House #123, Road #10"
                                      required
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Dhaka"
                                    required
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Postal Code <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="1207"
                                    type="number"
                                    maxLength={4}
                                    required
                                    {...field}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^0-9]/g, '');
                                      if (value.length <= 4) {
                                        field.onChange(value);
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Bangladesh"
                                    disabled
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          /> */}
                        </div>
                      </div>

                      <div>
                        <h2 className="mb-4 text-xl font-semibold">Payment Method</h2>
                        <div className="space-y-3">
                          <Label htmlFor="cashOnDelivery" className="cursor-pointer">
                            Cash on Delivery
                          </Label>
                        </div>
                        {/* Agreement Checkbox Section */}
                        <div className="mt-6">
                          <div className="mb-4 rounded border border-gray-200 bg-gray-100 p-4 text-gray-700 text-sm">
                            Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{' '}
                            <Link href="/privacy" className="text-green-700 font-semibold hover:underline" target="_blank">Privacy Policy</Link>.
                            (পেমেন্ট বা অর্ডার সংক্রান্ত যেকোনো সাহায্যের জন্য, অনুগ্রহ করে এখানে ইনবক্স করুন) <a href="https://wa.me/8801717171717" target="_blank" className="text-green-700 font-semibold hover:underline">এখানে</a>
                          </div>
                          <div className="flex items-center mb-6">
                            <input
                              id="agreement"
                              type="checkbox"
                              checked={agreed}
                              onChange={() => setAgreed(!agreed)}
                              className="h-5 w-5 border-gray-300 rounded mr-3 focus:ring-green-700"
                              required
                            />
                            <label htmlFor="agreement" className="text-gray-800 select-none">
                              I have read and agree to the website{' '}
                              <Link href="/terms" className="text-green-700 font-semibold hover:underline" target="_blank">Terms & Conditions</Link>,{' '}
                              <Link href="/privacy" className="text-green-700 font-semibold hover:underline" target="_blank">Privacy Policy</Link> and{' '}
                              <Link href="/return-policy" className="text-green-700 font-semibold hover:underline" target="_blank">Return Policy</Link>
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-green-700 hover:bg-green-800"
                        disabled={loading || !agreed}
                      >
                        {loading ? "Processing Payment..." : "Place Order"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

                  <div className="divide-y">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.selectedPackage}`} className="flex items-center gap-3 py-3">
                        <div className="relative h-16 w-16 overflow-hidden rounded">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-green-700 text-xs text-white">
                            {item.quantity}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">৳ {getItemPrice(item)} × {item.quantity}</div>
                        </div>
                        <div className="ml-auto font-medium">
                          ৳ {item.totalPrice}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>৳ {calculateSubtotal()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {calculateShipping() === 0
                          ? "Free"
                          : `৳ ${calculateShipping()}`}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>৳ {calculateTotal()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4 text-center">
                <Link
                  href="/cart"
                  className="text-sm text-muted-foreground hover:text-green-700"
                >
                  Return to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
