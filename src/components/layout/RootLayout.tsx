"use client";

import type { ReactNode } from "react";
import { BottomMenuBar } from "@/components/admin/BottomMenuBar";
import Header from "./Header";
import Footer from "./Footer";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <BottomMenuBar />
    </div>
  );
}
