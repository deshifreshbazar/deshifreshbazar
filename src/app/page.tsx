"use client";

import type React from "react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession } from "next-auth/react";
import RootLayout from "@/components/layout/RootLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Truck, Shield, Award, Phone } from "lucide-react";
import { FaFacebookMessenger } from "react-icons/fa";
import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import HeroSlider from "@/components/HeroSlider";
import YouTubeVideo from "@/components/YouTubeVideo";
import GoogleAuthCallback from "@/components/GoogleAuthCallback";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/components/ui/toast";

import garden from "@/assets/images/farmar.jpg";
import product from "@/assets/images/gobindovog-mango.jpg";
import packaging from "@/assets/images/gopalvog.jpg";
import delivery from "@/assets/images/mango-delivary.jpeg";
import brandLogo from "@/assets/images/fresh-bazar.jpg";

type Feature = {
  id: string;
  title: string;
  description: string;
  image: string | StaticImageData;
  icon: React.ReactNode;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
  discount?: number;
  sequence: number;
};

// Memoized feature carousel component
const MobileFeatureCarousel = ({ features }: { features: Feature[] }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-white shadow-lg">
      {features.map((feature, idx) => {
        const isActive = idx === current;
        return (
          <div
            key={feature.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              isActive
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-full"
            }`}
          >
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="mb-6 relative">
                <div className="w-48 h-36 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    width={192}
                    height={144}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {feature.id}
                </div>
              </div>
              <div className="mb-2 text-green-600">{feature.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        );
      })}

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {features.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === current ? "bg-green-500 w-6" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Memoized product card component
const ProductCard = ({ product }: { product: Product }) => (
  <Link
    href={`/product/${product.id}`}
    className="group block focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-2xl"
  >
    <Card className="overflow-hidden h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 border-0 shadow-md">
      <div className="relative aspect-square overflow-hidden">
        {product.discount && (
          <Badge className="absolute top-3 left-3 z-10 bg-red-500 hover:bg-red-600">
            -{product.discount}%
          </Badge>
        )}
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < (product.rating || 5) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">
            ({product.rating || 5}.0)
          </span>
        </div>
        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product.discount && (
              <span className="text-sm text-gray-400 line-through">
                ৳{Math.round(product.price * (1 + product.discount / 100))}
              </span>
            )}
            <span className="text-lg font-bold text-green-600">
              ৳{product.price}
            </span>
          </div>
          <ArrowRight className="w-5 h-5 text-green-500 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  </Link>
);

// Loading skeleton component
const ProductSkeleton = () => (
  <Card className="overflow-hidden h-full animate-pulse">
    <div className="aspect-square bg-gray-200" />
    <CardContent className="p-4">
      <div className="h-4 bg-gray-200 rounded mb-2" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </CardContent>
  </Card>
);

function HomePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUser();
  const { success: showSuccess, error: showError } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthCallback, setIsAuthCallback] = useState(false);

  const features = useMemo(
    () => [
      {
        id: "01",
        title: "নিবন্ধিত নিরাপদ বাগান",
        description:
          "আমরা আমাদের নিবন্ধিত ও ক্ষতিকর রাসায়নিক মুক্ত ফলের বাগান থেকে ফল সংগ্রহ করি।",
        image: garden.src,
        icon: <Shield className="w-8 h-8" />,
      },
      {
        id: "02",
        title: "প্রিমিয়াম মানের পণ্য",
        description:
          "আনার সর্বোত্তম অভিজ্ঞতার জন্য আমরা শুধুমাত্র প্রিমিয়াম মানের ফল নির্বাচন ও বাছাই করি।",
        image: product.src,
        icon: <Award className="w-8 h-8" />,
      },
      {
        id: "03",
        title: "প্রিমিয়াম প্যাকেজিং",
        description:
          "আপনি নিজের, পরিবার বা বন্ধুদের উপহার দিতে চান। আমরা সেরা প্যাকেজ করেছি!",
        image: packaging.src,
        icon: <Award className="w-8 h-8" />,
      },
      {
        id: "04",
        title: "বাগান তাজা ডেলিভারি",
        description:
          "আমরা গ্রাহকদের কাছ থেকে প্রি-অর্ডার নিই এবং বাগান থেকে টেবলে দ্রুত ডেলিভারি করি।",
        image: delivery.src,
        icon: <Truck className="w-8 h-8" />,
      },
    ],
    [],
  );

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid data format received");
      // Sort products by sequence before slicing
      const sortedProducts = [...data].sort((a, b) => a.sequence - b.sequence);
      setFeaturedProducts(sortedProducts.slice(0, 8)); // Get first 8 products
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Google Auth callback if user lands on homepage after authentication
  useEffect(() => {
    const handleGoogleCallback = async () => {
      const googleAuth = searchParams?.get("google_auth");

      if (googleAuth === "success") {
        setIsAuthCallback(true);
        try {
          // Get the session after Google redirect
          const session = await getSession();

          if (session?.user) {
            setUser({
              id: session.user.id,
              name: session.user.name || "",
              email: session.user.email || "",
              role: session.user.role as "USER" | "ADMIN",
            });

            // Show appropriate success message based on user status
            if (session.user.isNewUser) {
              showSuccess(
                "Account created successfully! Welcome to Deshi Fresh Bazar!",
              );
            } else {
              showSuccess("Login successful! Welcome back!");
            }

            // Clean up URL
            const url = new URL(window.location.href);
            url.searchParams.delete("google_auth");
            window.history.replaceState({}, "", url.toString());

            // If admin, redirect to admin panel after delay
            if (session.user.role === "ADMIN") {
              setTimeout(() => {
                router.push("/admin");
              }, 1500);
            }
          }
        } catch (error) {
          console.error("Error handling Google callback:", error);
          showError(
            "Authentication completed, but there was an issue. Please try signing in again.",
          );
        } finally {
          setTimeout(() => setIsAuthCallback(false), 2000);
        }
      }
    };

    handleGoogleCallback();
  }, [searchParams, setUser, showSuccess, showError, router]);

  // Show callback component if processing Google Auth
  if (isAuthCallback) {
    return <GoogleAuthCallback />;
  }

  if (loading) {
    return (
      <RootLayout>
        <div className="flex items-center justify-center min-h-screen bg-white">
          <div className="relative w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] animate-pulse">
            <Image
              src={brandLogo || "/placeholder.svg"}
              alt="Fresh Bazar Loading"
              fill
              className="object-contain animate-bounce"
              priority
            />
          </div>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      {/* Hero Section */}
      <HeroSlider />

      {/* Fixed Social Media Icons for Mobile */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-50 md:hidden">
        {/* WhatsApp */}
        <a
          href="https://api.whatsapp.com/send/?phone=8801560001192"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          aria-label="Contact on WhatsApp"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>

        {/* Messenger */}
        <a
          href="https://m.me/deshifreshbazar"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          aria-label="Contact on Messenger"
        >
          <FaFacebookMessenger
            className="w-6 h-6 text-black object-cover"
            color="black"
          />
        </a>

        {/* Phone */}
        <a
          href="tel:01560001192"
          className="bg-red-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          aria-label="Call us"
        >
          <Phone className="w-6 h-6 text-white" />
        </a>
      </div>

      {/* Featured Products Section */}
      <section className="py-5 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge
              variant="outline"
              className="mb-4 text-green-600 border-green-200"
            >
              আমাদের পণ্য
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              তাজা ফলের সংগ্রহ
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))
              : featuredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="block focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-lg"
                  >
                    <Card className="overflow-hidden h-full border-0 shadow-md hover:shadow-xl transition-all duration-300">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <CardContent className="p-3 sm:p-4">
                        <div className="block sm:hidden">
                          <h3 className="font-medium text-sm mb-1 line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 text-xs mb-1.5 line-clamp-2">
                            {product.description}
                          </p>
                          <p className="text-green-700 font-medium text-sm">
                            ৳ {product.price}
                          </p>
                        </div>
                        <div className="hidden sm:block">
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < (product.rating || 5) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                            <span className="text-sm text-gray-500 ml-1">
                              ({product.rating || 5}.0)
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {product.discount && (
                                <span className="text-sm text-gray-400 line-through">
                                  ৳
                                  {Math.round(
                                    product.price *
                                      (1 + product.discount / 100),
                                  )}
                                </span>
                              )}
                              <span className="text-lg font-bold text-green-600">
                                ৳{product.price}
                              </span>
                            </div>
                            <ArrowRight className="w-5 h-5 text-green-500 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
          </div>

          <div className="text-center">
            <Button
              asChild
              variant="outline"
              className="border-green-700 text-green-700 hover:bg-green-700 hover:text-white"
            >
              <Link href="/fruits">View all products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why We Are Different Section */}
      <section className="py-10 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 text-green-600 border-green-200"
            >
              আমাদের বিশেষত্ব
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              আমরা কেন আলাদা?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              আমাদের ভিন্নধর্মী পদ্ধতি ও নিরবচ্ছিন্ন প্রতিশ্রুতি—এটাই আমাদেরকে
              অন্যদের থেকে আলাদা করে তোলে।
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-6 rounded-full" />
          </div>

          {/* Intro Video */}
          <div className="mb-20">
            <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-green-50 to-white">
              <YouTubeVideo
                videoId="j2hduSXuU8o"
                title="Welcome to Deshi Fresh Bazar"
                className="group"
                autoPlay={false}
                mute={false}
              />
            </Card>
          </div>

          {/* Features */}
          <div className="block lg:hidden mb-12">
            <MobileFeatureCarousel features={features} />
          </div>

          <div className="hidden lg:grid lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={feature.id}
                className="group hover:shadow-xl transition-all duration-500 border-0 shadow-md hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="relative mb-6">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src={feature.image || "/placeholder.svg"}
                        alt={feature.title}
                        width={280}
                        height={210}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {feature.id}
                    </div>
                  </div>
                  <div className="mb-4 text-green-600 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Stories Section */}
      <section className="py-10 bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 text-green-600 border-green-200"
            >
              আমাদের যাত্রা
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              আমাদের গল্প
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              কীভাবে আমরা বাগান থেকে আপনার টেবিল পর্যন্ত মানসম্পন্ন ফল পৌঁছে দিই
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {[
              {
                title: "নিবন্ধিত বাগান থেকে সরাসরি ফল সংগ্রহ",
                description:
                  "আমাদের নিবন্ধিত বাগান থেকে আমরা কীভাবে সাবধানে তাজা ফল সংগ্রহ করি।",
                videoId: "L6bSkrqZsi4",
                thumbnail: "/src/assets/images/farmar.jpg",
              },
              {
                title: "আমাদের প্রিমিয়াম প্যাকেজিং প্রক্রিয়া",
                description:
                  "আমাদের সক্ষ্ম প্যাকেজিং প্রক্রিয়া যা ফলের তাজা ও নিখুঁত অবস্থা নিশ্চিত করে।",
                videoId: "VQyuPf1QiVM",
                thumbnail: "/src/assets/images/gopalvog.jpg",
              },
            ].map((video, index) => (
              <Card
                key={index}
                className="group overflow-hidden shadow-xl border-0 hover:shadow-2xl transition-all duration-500"
              >
                <YouTubeVideo
                  videoId={video.videoId}
                  title={video.title}
                  className=""
                  autoPlay={false}
                  mute={false}
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {video.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-6 text-lg">
              আপনার অর্ডার দিতে নিচের বাটনে ক্লিক করুন
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/fruits" className="flex items-center gap-2">
                এখনই কিনুন
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </RootLayout>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageInner />
    </Suspense>
  );
}
