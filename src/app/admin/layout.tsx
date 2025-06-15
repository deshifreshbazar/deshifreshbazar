'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { BottomMenuBar } from '@/components/admin/BottomMenuBar';
import { useUser } from '@/contexts/UserContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-[#fcfdff]">
      <div className="flex min-h-screen">
        <aside className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:bg-[#101828] md:text-white md:z-20 md:flex md:flex-col md:shadow-xl">
          <div className="p-6 text-2xl font-bold border-b border-[#1a2233]">
            <Link href="/admin" className="hover:text-gray-200 transition-colors">Admin Panel</Link>
          </div>
          <nav className="flex-1 flex flex-col gap-2 px-4 py-4">
            <Link
              href="/admin"
              className={`py-2 px-3 rounded transition-colors duration-200 ${isActive('/admin') ? 'bg-[#1a2233] text-white' : 'hover:bg-[#1a2233]'}`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className={`py-2 px-3 rounded transition-colors duration-200 ${isActive('/admin/products') ? 'bg-[#1a2233] text-white' : 'hover:bg-[#1a2233]'}`}
            >
              Products
            </Link>
            <Link
              href="/admin/orders"
              className={`py-2 px-3 rounded transition-colors duration-200 ${isActive('/admin/orders') ? 'bg-[#1a2233] text-white' : 'hover:bg-[#1a2233]'}`}
            >
              Orders
            </Link>
          </nav>
          <div className="sticky bottom-0 p-4 border-t border-[#1a2233] bg-[#101828] mt-auto">
            <button
              onClick={handleLogout}
              className="w-full py-2 px-3 rounded bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 flex items-center gap-2 justify-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#101828]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              Logout
            </button>
          </div>
        </aside>
        <main className="flex-1 bg-[#f9fafb] min-h-screen p-0 md:ml-64 md:p-8 overflow-x-auto">
          {children}
        </main>
      </div>
      <BottomMenuBar />
    </div>
  );
}