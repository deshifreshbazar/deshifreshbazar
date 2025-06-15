import "@/app/globals.css";
import type { Metadata } from "next";
import ClientBody from "./ClientBody";
import { CartProvider } from '@/contexts/CartContext';
import favicon from "@/assets/favicon/favicon.ico";
import { UserProvider } from "@/contexts/UserContext";

export const metadata: Metadata = {
  title: "Deshi Fresh Bazar",
  description: "Deshi Fresh Bazar (PF) is an Agritech Fruit chain initiative delivering safer fruits directly from gardens to your doorstep.",
  icons: {
    icon: favicon.src,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
