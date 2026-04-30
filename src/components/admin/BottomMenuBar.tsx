'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, ShoppingCart } from 'lucide-react';
import { FaBoxOpen, FaShoppingCart, FaUsers, FaChartBar } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';

type BottomMenuBarProps = {
  mode?: 'admin' | 'storefront';
};

export function BottomMenuBar({ mode = 'storefront' }: BottomMenuBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const adminItems = [
    { path: '/admin', icon: FaChartBar, label: 'Dashboard' },
    { path: '/admin/products', icon: FaBoxOpen, label: 'Products' },
    { path: '/admin/orders', icon: FaShoppingCart, label: 'Orders' },
    { path: '/admin/users', icon: FaUsers, label: 'Users' },
  ];

  const storefrontItems = [
    { key: 'home', path: '/', icon: Home, label: 'Home' },
    { key: 'search', path: '/fruits?focus=search', icon: Search, label: 'Search' },
    { key: 'cart', path: '/cart', icon: ShoppingCart, label: 'Cart' },
  ];

  if (mode === 'admin') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-around border-t bg-white md:hidden">
        {adminItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
            >
              <Icon className="text-xl" />
              <span className="mt-1 text-xs">{item.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 shadow-[0_-6px_20px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
      <div className="mx-auto flex h-14 max-w-md items-center justify-around px-4">
        {storefrontItems.map((item) => {
          const Icon = item.icon;
          const isSearch = item.key === 'search';
          const isCart = item.key === 'cart';
          const isActive =
            (item.key === 'home' && pathname === '/') ||
            (isSearch && pathname === '/fruits') ||
            (isCart && pathname === '/cart');

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => router.push(item.path)}
              className={`relative flex min-w-[72px] flex-col items-center justify-center gap-0.5 ${
                isActive ? 'text-green-700' : 'text-gray-500'
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  isActive ? 'bg-green-50' : 'bg-transparent'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              {isCart && cartCount > 0 && (
                <span className="absolute right-4 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-green-700 px-1 text-[9px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
              <span className="text-[11px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
