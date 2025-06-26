'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface OrderItem {
  id: string;
  productId: string;
  productName?: string;
  productImage?: string;
  quantity: number;
  unitPrice?: number;
  price?: number;
  totalPrice?: number;
  packageType?: string;
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (!user) {
    return (
      <>
        <Header />
        <div className="container py-8">Please log in to view your orders.</div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container py-8">Loading...</div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container py-8 text-red-600">{error}</div>
        <Footer />
      </>
    );
  }

  
  return (
    <>
      <Header />
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Order #{order.id.slice(-6)}</span>
                    <span className="text-sm font-normal">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span className="capitalize">{order.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total Amount:</span>
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Items:</span>
                      <div className="mt-2 space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                            <div className="flex items-center gap-3">
                              {item.productImage && (
                                <img src={item.productImage} alt={item.productName || `Product ${item.productId}`} className="w-12 h-12 object-cover rounded" />
                              )}
                              <div>
                                <div className="font-medium">{item.productName || `Product #${item.productId}`}</div>
                                {item.packageType && <div className="text-xs text-gray-500">Package: {item.packageType}</div>}
                              </div>
                            </div>
                            <div className="text-right mt-2 md:mt-0">
                              <div>{item.quantity} x ${item.unitPrice?.toFixed(2) ?? item.price?.toFixed(2) ?? '0.00'}</div>
                              {item.totalPrice !== undefined && (
                                <div className="text-xs text-gray-500">Total: ${item.totalPrice.toFixed(2)}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}