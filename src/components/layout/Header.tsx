"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { getCartCount } = useCart();
  const { user, logout } = useUser();
  const cartCount = getCartCount();
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

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
      <div className="container relative flex h-20 items-center justify-between md:h-16">
        
        {/* Mobile Menu (Left) */}
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2">
                <Menu className="h-10 w-10" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
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
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground w-fit relative mt-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-green-700 text-[10px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                  <span>Cart</span>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Deshi Fresh Bazar"
              width={80}
              height={15}
              className="h-[55px] w-auto transition-all duration-200 lg:h-[60px] xl:h-[65px] 2xl:h-[70px]"
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

        <Link
          href="/"
          className="absolute left-1/2 flex -translate-x-1/2 items-center md:hidden"
        >
          <Image
            src={logo}
            alt="Deshi Fresh Bazar"
            width={120}
            height={24}
            className="h-[58px] w-auto transition-all duration-200"
            priority
            quality={100}
          />
        </Link>

        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/cart" className="hidden md:flex items-center gap-2 relative">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-green-700 text-[10px] font-bold text-white md:-top-4 md:h-5 md:w-5 md:text-xs">
                {cartCount}
              </span>
            )}
            <span className="hidden text-sm font-medium sm:inline-block">Cart</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="rounded-full h-8 w-8 md:h-9 md:w-9"
                  />
                ) : (
                  <User className="h-8 w-8 md:h-6 md:w-6" />
                )}
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
                  <DropdownMenuItem
                    onClick={() => {
                      void handleLogout();
                    }}
                    className="text-red-600"
                  >
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
        </div>
      </div>
    </header>
  );
}
