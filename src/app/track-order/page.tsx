"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import RootLayout from "@/components/layout/RootLayout";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState<null | string>(null);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrderStatus(null);
    setNotFound(false);
    if (!orderId) {
      setError("Please enter an order ID");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.status === 404) {
        setNotFound(true);
        setOrderStatus(null);
      } else if (!res.ok) {
        setError("Something went wrong. Please try again.");
      } else {
        const data = await res.json();
        setOrderStatus(data.status || "Unknown");
      }
    } catch (err) {
      setError("Failed to fetch order status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RootLayout>
      <div className="bg-gray-50 py-12">
        <div className="container max-w-2xl">
          <Card>
            <CardContent className="p-6">
              <h1 className="mb-6 text-2xl font-bold text-center">
                Track Your Order
              </h1>
              
              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-4">
                  <Input
                    type="text"
                    placeholder="Enter your order ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" className="bg-green-700 hover:bg-green-800" disabled={loading}>
                    {loading ? "Loading..." : "Track"}
                  </Button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </form>

              {notFound && (
                <div className="rounded-lg bg-gray-100 p-4">
                  <h2 className="mb-2 font-semibold">Order Status</h2>
                  <p className="text-red-700">No data found</p>
                </div>
              )}

              {orderStatus && !notFound && (
                <div className="rounded-lg bg-gray-100 p-4">
                  <h2 className="mb-2 font-semibold">Order Status</h2>
                  <p className="text-green-700">{orderStatus}</p>
                </div>
              )}

              <div className="mt-6 text-center text-muted-foreground">
                <p className="text-sm">
                  অর্ডার সম্পর্কিত যেকোনো তথ্যের জন্য যোগাযোগ করুন: 01560-001192
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RootLayout>
  );
}