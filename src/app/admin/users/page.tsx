"use client";
import { useState, useEffect } from 'react';
import { FaBoxOpen, FaShoppingCart, FaUsers, FaChartBar, FaCrown, FaUserPlus, FaFilter } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/ui/loader';
import { useUser } from '@/contexts/UserContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  ordersCount: number;
  totalSpent: number;
  lastOrder: string | null;
  deliveredCount: number;
  pendingCount: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, delivered: 0, admins: 0 });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { logout } = useUser();
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
        setStats({
          total: data.length,
          pending: data.reduce((sum: number, u: any) => sum + (u.pendingCount || 0), 0),
          delivered: data.reduce((sum: number, u: any) => sum + (u.deliveredCount || 0), 0),
          admins: data.filter((u: any) => u.role === 'ADMIN').length,
        });
      } catch (e) {
        setUsers([]);
        setStats({ total: 0, pending: 0, delivered: 0, admins: 0 });
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <>
      {/* Mobile Users Page */}
      <div className="block md:hidden bg-[#fcfdff] min-h-screen pb-24">
        <div className="flex justify-between items-center px-4 pt-4 pb-2">
          <h1 className="text-2xl font-bold">Users</h1>
          <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg">
            <FaUserPlus className="text-lg" /> Log Out
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 px-4 mb-4 mt-2">
          <div className="bg-white rounded-xl p-3 flex flex-col items-center shadow border">
            <FaUsers className="text-xl text-blue-500 mb-1" />
            <div className="font-bold text-lg">{stats.total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="bg-white rounded-xl p-3 flex flex-col items-center shadow border">
            <FaUsers className="text-xl text-green-500 mb-1" />
            <div className="font-bold text-lg">{stats.pending}</div>
            <div className="text-xs text-gray-500">Pandning</div>
          </div>
          <div className="bg-white rounded-xl p-3 flex flex-col items-center shadow border">
            <FaUsers className="text-xl text-purple-500 mb-1" />
            <div className="font-bold text-lg">{stats.delivered}</div>
            <div className="text-xs text-gray-500">Deliverd</div>
          </div>
          <div className="bg-white rounded-xl p-3 flex flex-col items-center shadow border">
            <FaCrown className="text-xl text-orange-500 mb-1" />
            <div className="font-bold text-lg">{stats.admins}</div>
            <div className="text-xs text-gray-500">Admins</div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 mb-3">
          <Input
            type="search"
            placeholder="Search users..."
            className="flex-1 rounded-lg"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Button variant="outline" className="rounded-lg px-3 py-2">
            <FaFilter />
          </Button>
        </div>
        {filteredUsers.length === 0 ? (
          <div className="text-center text-gray-500 py-16 text-lg">No users found</div>
        ) : (
          <div className="flex flex-col gap-4 px-2">
            {filteredUsers.map(user => (
              <div key={user.id} className="bg-white rounded-xl shadow border p-4 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-600">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-base text-gray-900 flex items-center gap-2">
                      {user.name}
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>{user.role === 'ADMIN' ? <FaCrown className="inline mr-1" /> : <FaUsers className="inline mr-1" />} {user.role}</span>
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="1"/><circle cx="10" cy="15" r="1"/><circle cx="10" cy="5" r="1"/></svg>
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs mt-1">
                  <span className={`px-2 py-1 rounded-full font-semibold ${user.role === 'CUSTOMER' ? (user.deliveredCount > 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700') : 'bg-blue-100 text-blue-700'}`}>{user.role === 'CUSTOMER' ? (user.deliveredCount > 0 ? 'Delivered' : 'Pending') : 'Admin'}</span>
                  <span className="text-gray-500">{user.role === 'CUSTOMER' ? (user.deliveredCount > 0 ? 'Deliver time: ' + user.lastOrder : 'Order time: ' + user.lastOrder) : ''}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2 mt-2">
                  <div className="text-center">
                    <div className="font-bold text-lg">{user.ordersCount}</div>
                    <div className="text-xs text-gray-500">Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">${user.totalSpent.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">Total Spent</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Desktop Users Page (placeholder) */}
      <div className="hidden md:block">
        {/* ...existing desktop users page code or placeholder... */}
      </div>
    </>
  );
} 