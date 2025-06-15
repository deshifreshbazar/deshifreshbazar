"use client";

// For static site generation
export const dynamic = 'force-static';

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Copy } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import RootLayout from "@/components/layout/RootLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Order {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  createdAt: string;
}

function OrderDetails() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams?.get("orderId");

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.message === 'Order not found') {
            setError('Order not found');
          } else {
            setOrder(data);
          }
        })
        .catch(err => {
          setError('Failed to fetch order');
          console.error('Error fetching order:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (!searchParams) {
    return <div>Loading...</div>;
  }

  const formData = {
    fullName: order?.customerName || searchParams.get("fullName") || "N/A",
    email: order?.customerEmail || searchParams.get("email") || "N/A",
    phone: order?.customerPhone || searchParams.get("phone") || "N/A",
    address: order?.shippingAddress || searchParams.get("address") || "N/A",
    city: order?.shippingCity || searchParams.get("city") || "N/A",
    postalCode: order?.shippingPostalCode || searchParams.get("postalCode") || "N/A",
  };

  const orderDate = order?.createdAt 
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  if (loading) {
    return <div>Loading order details...</div>;
  }

  if (error) {
    return (
      <div className="container max-w-2xl">
        <Card className="overflow-hidden">
          <div className="bg-red-700 p-6 text-center text-white">
            <h1 className="text-3xl font-bold">Order Not Found</h1>
            <p className="mt-2 text-red-100">
              We couldn't find the order you're looking for
            </p>
          </div>
          <CardFooter className="flex flex-col gap-4 p-6">
            <Button
              asChild
              variant="outline"
              className="w-full"
            >
              <Link href="/">Continue Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl">
      <Card className="overflow-hidden">
        <div className="bg-green-700 p-6 text-center text-white">
          <CheckCircle className="mx-auto mb-4 h-16 w-16" />
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="mt-2 text-green-100">
            Thank you for your purchase
          </p>
        </div>
        <CardContent className="p-6">
          <div className="mb-6 text-center">
            <p className="text-muted-foreground">
            আমরা আপনার অর্ডার পেয়েছি এবং আপনার প্যাকেজ পাঠানোর সাথে সাথেই আপনার সাথে যোগাযোগ করব। আপনি নীচে আপনার ক্রয়ের তথ্য পেতে পারেন।
            </p>
          </div>

          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <div className="mb-4">
              <p className="text-sm font-medium text-muted-foreground">
                Order Number
              </p>
              <div className="flex items-center gap-2">
                <p className="font-medium">{orderId}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(orderId || '');
                  }}
                  className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                  title="Copy order number"
                >
                  <Copy className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <p className="text-sm font-medium text-muted-foreground mt-2">
                Date
              </p>
              <p className="font-medium">{orderDate}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-muted-foreground">
                Email
              </p>
              <p className="font-medium">{formData.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Order Status
              </p>
              <p className={`font-medium ${
                order?.status === 'DELIVERED' ? 'text-green-600' :
                order?.status === 'CANCELLED' ? 'text-red-600' :
                'text-blue-600'
              }`}>
                {order?.status || 'Processing'}
              </p>
            </div>
          </div>
          <div className="border-t pt-6">
            <h2 className="mb-4 text-lg font-semibold">
              Delivery Information
            </h2>
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="font-medium text center">{formData.fullName}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="font-medium text-right">{formData.address}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <label className="text-sm font-medium text-muted-foreground">City & Postal Code</label>
                <p className="font-medium text-right">{formData.city}, {formData.postalCode}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <label className="text-sm font-medium text-muted-foreground">Country</label>
                <p className="font-medium text-right">Bangladesh</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="font-medium text-right">{formData.phone}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 p-6">
          <Button
            asChild
            className="w-full bg-green-700 hover:bg-green-800"
          >
            <Link href="/track-order">Track Your Order</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full"
          >
            <Link href="/">Continue Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <RootLayout>
      <div className="bg-gray-50 py-12">
        <Suspense fallback={<div>Loading...</div>}>
          <OrderDetails />
        </Suspense>
      </div>
    </RootLayout>
  );
}
