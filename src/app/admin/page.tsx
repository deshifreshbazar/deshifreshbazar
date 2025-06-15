'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { FaDollarSign, FaBoxOpen, FaShoppingCart, FaUsers } from 'react-icons/fa';
import { Loader } from '@/components/ui/loader';
import { OrderStatsChart } from '@/components/OrderStatsChart';

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: number;
  totalRevenue?: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <>
      {/* Mobile Dashboard */}
      <div className="block md:hidden bg-[#fcfdff] min-h-screen flex flex-col pb-24">
        <h1 className="text-3xl font-bold text-center mt-6 mb-2">Dashboard</h1>
        <p className="text-center text-gray-500 mb-4">Welcome back! Deshi Fresh Bazar store overview.</p>
        <div className="grid grid-cols-2 gap-4 px-4 mb-4">
          <div className="bg-white rounded-xl p-4 flex flex-col items-start shadow border">
            <span className="text-xs text-gray-500 mb-1">TOTAL REVENUE</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">${stats.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}</span>
              <span className="bg-blue-50 text-blue-500 rounded-full p-2"><FaDollarSign /></span>
            </div>
            <span className="text-xs text-green-600 mt-1 font-semibold">+12.5%</span>
          </div>
          <div className="bg-white rounded-xl p-4 flex flex-col items-start shadow border">
            <span className="text-xs text-gray-500 mb-1">TOTAL ORDERS</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{stats.totalOrders}</span>
              <span className="bg-blue-50 text-blue-500 rounded-full p-2"><FaShoppingCart /></span>
            </div>
            <span className="text-xs text-green-600 mt-1 font-semibold">+8.2%</span>
          </div>
          <div className="bg-white rounded-xl p-4 flex flex-col items-start shadow border">
            <span className="text-xs text-gray-500 mb-1">PRODUCTS</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{stats.totalProducts}</span>
              <span className="bg-blue-50 text-blue-500 rounded-full p-2"><FaBoxOpen /></span>
            </div>
            <span className="text-xs text-green-600 mt-1 font-semibold">+3</span>
          </div>
          <div className="bg-white rounded-xl p-4 flex flex-col items-start shadow border">
            <span className="text-xs text-gray-500 mb-1">ACTIVE USERS</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{stats.totalUsers}</span>
              <span className="bg-blue-50 text-blue-500 rounded-full p-2"><FaUsers /></span>
            </div>
            <span className="text-xs text-green-600 mt-1 font-semibold">+15.3%</span>
          </div>
        </div>
        <div className="px-4">
          <OrderStatsChart />
        </div>
        <div className="px-4 mt-6">
          <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push('/admin/products/add')}
              className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 rounded-xl py-6 font-medium shadow border"
            >
              <FaBoxOpen className="text-2xl mb-2" />
              Add Product
            </button>
            <button
              onClick={() => router.push('/admin/orders')}
              className="flex flex-col items-center justify-center bg-green-50 text-green-700 rounded-xl py-6 font-medium shadow border"
            >
              <FaShoppingCart className="text-2xl mb-2" />
              View Orders
            </button>
          </div>
        </div>
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 z-50 md:hidden">
          <button onClick={() => router.push('/admin')} className="flex flex-col items-center text-blue-600">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bar-chart-2"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg>
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          <button onClick={() => router.push('/admin/products')} className="flex flex-col items-center text-gray-500">
            <FaBoxOpen className="text-xl" />
            <span className="text-xs mt-1">Products</span>
          </button>
          <button onClick={() => router.push('/admin/orders')} className="flex flex-col items-center text-gray-500">
            <FaShoppingCart className="text-xl" />
            <span className="text-xs mt-1">Orders</span>
          </button>
          <button onClick={() => router.push('/admin/users')} className="flex flex-col items-center text-gray-500">
            <FaUsers className="text-xl" />
            <span className="text-xs mt-1">Users</span>
          </button>
        </nav>
      </div>
      {/* Desktop Dashboard */}
      <div className="hidden md:block">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentOrders}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <OrderStatsChart />
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/admin/products')}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              Manage Products
            </button>
            <button
              onClick={() => router.push('/admin/orders')}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              View Orders
            </button>
            <button
              onClick={() => router.push('/admin/products/add')}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              Add New Product
            </button>
          </div>
        </div>
      </div>
    </>
  );
}