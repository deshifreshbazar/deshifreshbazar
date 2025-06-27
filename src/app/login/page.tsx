"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import RootLayout from "@/components/layout/RootLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "@/lib/auth";
import { useUser } from "@/contexts/UserContext";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUser();
  const { success: showSuccess, error: showError } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // Check for success message from registration
  useEffect(() => {
    const success = searchParams?.get("success");
    if (success === "registered") {
      showSuccess("Account created successfully! Please sign in.");
    }
  }, [searchParams]);

  // Handle Google Auth callback and session updates
  useEffect(() => {
    const handleGoogleCallback = async () => {
      const googleAuth = searchParams?.get("google_auth");

      if (googleAuth === "success") {
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

            // Redirect based on role after a short delay for user to see the message
            setTimeout(() => {
              if (session.user.role === "ADMIN") {
                router.push("/admin");
              } else {
                router.push("/");
              }
            }, 1500);
          }
        } catch (error) {
          console.error("Error handling Google callback:", error);
          showError(
            "Authentication completed, but there was an issue. Please try signing in again.",
          );
        }
      }
    };

    handleGoogleCallback();
  }, [searchParams, setUser, showSuccess, showError, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      // Use redirect method for better mobile compatibility
      // Don't show loading toast here as it will be interrupted by redirect
      const result = await signIn("google", {
        callbackUrl: `${window.location.origin}?google_auth=success`,
        redirect: true, // Allow natural redirect flow
      });

      // This code won't execute due to redirect, but keep as fallback
      if (result?.error) {
        console.error("Google sign-in error:", result.error);
        setError("Google sign-in failed. Please try again.");
        showError("Google sign-in failed. Please try again.");
        setGoogleLoading(false);
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google sign-in failed. Please try again.");
      showError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(formData);
      // Set user data in context
      setUser({
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
      });

      // Show success message
      showSuccess("Login successful! Welcome back!");

      // Redirect based on role
      setTimeout(() => {
        if (result.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 1000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RootLayout>
      <div className="container py-12">
        <div className="mx-auto max-w-md">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-600">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Google Sign In Button */}
              <GoogleSignInButton
                onClick={handleGoogleSignIn}
                loading={googleLoading}
                className="w-full"
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-gray-700 font-medium"
                    >
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-green-600 hover:text-green-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-green-600 hover:text-green-700 font-medium hover:underline"
                >
                  Create account
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </RootLayout>
  );
}
