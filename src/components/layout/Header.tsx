"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import logo from "@/assets/images/fresh-logo.jpg";

export default function Header() {
  const { getCartCount } = useCart();
  const { user, logout } = useUser();
  const cartCount = getCartCount();

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Fruits", path: "/fruits" },
    // { title: "Corporate Gift", path: "/corporate-gift" },
    { title: "FAQ", path: "/faq" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" },
    { title: "Gallery", path: "/gallery" },
    { title: "Track Order", path: "/track-order" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Deshi Fresh Bazar"
              width={80}
              height={15}
              className="h-[40px] w-auto xs:h-[45px] sm:h-[50px] md:h-[55px] lg:h-[60px] xl:h-[65px] 2xl:h-[70px] transition-all duration-200"
              priority
              quality={100}
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/cart" className="sm:hidden relative mr-2">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-700 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/cart" className="hidden sm:flex items-center gap-2 relative">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-4 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-700 text-xs text-white">
                {cartCount}
              </span>
            )}
            <span className="text-sm font-medium">Cart</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register">Register</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.title}
                  </Link>
                ))}
                <Link
                  href="/cart"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground relative"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 left-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-700 text-xs text-white">
                      {cartCount}
                    </span>
                  )}
                  <span>Cart</span>
                </Link>
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
                    >
                      <span>My Orders</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 text-sm font-medium text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
                  >
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
