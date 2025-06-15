import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { useState } from "react";
import brandLogo from "@/assets/images/fresh-bazar.jpg";

export default function Footer() {
  return (
    <footer className="bg-gray-100 ">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {/* Brand section */}
          <div className="xl:col-span-2">
            <Link href="/" className="mb-4 inline-block transition-transform hover:scale-105">
              <Image
                src={brandLogo}
                alt="Deshi Fresh Bazar"
                width={200}
                height={60}
                className="h-[80px] w-auto xs:h-[60px] sm:h-[70px] md:h-[80px] lg:h-[100px] xl:h-[90px] 2xl:h-[100px] transition-all duration-200"
              />
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Deshi Fresh Bazar (PF) is an Agritech Fruit chain initiative by BD. We supply premium quality fruits from our contracted and registered fruit farmers.
            </p>
            

            {/* Social media links */}
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="https://www.facebook.com/deshifreshbazar"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-all hover:bg-green500 hover:text-white hover:shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/deshi_fresh_bazar"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-all hover:bg-green500 hover:text-white hover:shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.youtube.com/@DeshiFreshBazar"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-all hover:bg-green500 hover:text-white hover:shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Youtube"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Contact section */}
          <div className="space-y-6">
            <h3 className="relative text-base font-medium uppercase tracking-wider text-gray-800 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-12 after:bg-green500">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-green500" />
                <p className="text-sm text-gray-600">
                  <span className="block font-medium text-gray-800">Head Office:</span> House #3/E, Section Road (New), Dhanmondi, Dhaka North City, Bangladesh
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-green500" />
                <p className="text-sm text-gray-600">
                  <span className="block font-medium text-gray-800">Phone:</span> 01782285171
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 flex-shrink-0 text-green500" />
                <p className="text-sm text-gray-600">
                  <span className="block font-medium text-gray-800">Email:</span>
                  <a 
                    href="mailto:deshifreshbazar@gmail.com"
                    className="transition-colors hover:text-green500"
                  >
                    deshifreshbazar@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
          {/* Warehouses section */}
          <div className="space-y-6">
            <h3 className="relative text-base font-medium uppercase tracking-wider text-gray-800 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-12 after:bg-green500">Our Warehouses</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 md:bg-transparent md:p-0 md:shadow-none rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md md:hover:shadow-none">
                <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-green500" />
                <p className="text-sm text-gray-600">
                  <span className="block font-medium text-gray-800">Dhaka Warehouse:</span> Kalabagan, Kalabagan 1st Lane, House 31
                </p>
              </div>
              <div className="flex items-start gap-3 md:bg-transparent md:p-0 md:shadow-none rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md md:hover:shadow-none">
                <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-green500" />
                <p className="text-sm text-gray-600">
                  <span className="block font-medium text-gray-800">Chapainobabgonj Warehouse 1:</span> Mollikpur, Chapainobabgonj
                </p>
              </div>
              <div className="flex items-start gap-3 md:bg-transparent md:p-0 md:shadow-none rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md md:hover:shadow-none">
                <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-green500" />
                <p className="text-sm text-gray-600">
                  <span className="block font-medium text-gray-800">Chapainobabgonj Warehouse 2:</span> Kansat, Shibgonj
                </p>
              </div>
            </div>
          </div>

          {/* Links section */}
          <div className="space-y-6">
            <h3 className="relative text-base font-medium uppercase tracking-wider text-gray-800 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-12 after:bg-green500">Useful Links</h3>
            <nav className="flex flex-col space-y-2">
              {[
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact Us" },
                { href: "/faq", label: "FAQs" },
                { href: "/terms", label: "Terms & Conditions" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/return-policy", label: "Return Policy" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center text-sm text-gray-600 transition-colors hover:text-green500"
                >
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-gray-400 transition-all group-hover:bg-green500"></span>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Payment methods section */}
      
        </div>
      </div>

      {/* Copyright section */}
      <div className="border-t border-gray-200 bg-gray-50 py-4">
        <div className="container">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Deshi Fresh Bazar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
