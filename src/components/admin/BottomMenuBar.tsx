'use client';

import { usePathname, useRouter } from 'next/navigation';
import { FaBoxOpen, FaShoppingCart, FaUsers, FaChartBar } from 'react-icons/fa';

export function BottomMenuBar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { path: '/admin', icon: FaChartBar, label: 'Dashboard' },
    { path: '/admin/products', icon: FaBoxOpen, label: 'Products' },
    { path: '/admin/orders', icon: FaShoppingCart, label: 'Orders' },
    { path: '/admin/users', icon: FaUsers, label: 'Users' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 z-50 md:hidden">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        
        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
          >
            <Icon className="text-xl" />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
} 