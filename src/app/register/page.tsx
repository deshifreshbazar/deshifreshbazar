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
import { register } from "@/lib/auth";
import { useUser } from "@/contexts/UserContext";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface PasswordRequirements {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUser();
  const { success: showSuccess, error: showError } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] =
    useState<PasswordRequirements>({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    });
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password validation
  const validatePassword = (password: string): PasswordRequirements => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

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

            // Redirect to home page after a short delay for user to see the message
            setTimeout(() => {
              router.push("/");
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

  // Form validation
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    } else if (formData.name.trim().length < 4) {
      errors.name = "Name must be at least 4 characters long";
    } else if (formData.name.trim().length > 50) {
      errors.name = "Name must be less than 50 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      errors.name = "Name can only contain letters and spaces";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else {
      const requirements = validatePassword(formData.password);
      if (!Object.values(requirements).every(Boolean)) {
        errors.password = "Password does not meet all requirements";
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for the field being edited
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Update password requirements in real-time
    if (name === "password") {
      setPasswordRequirements(validatePassword(value));
    }

    // Clear general error
    if (error) {
      setError("");
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      // Use redirect method for better mobile compatibility
      // Don't show loading toast here as it will be interrupted by redirect
      const result = await signIn("google", {
        callbackUrl: `${window.location.origin}/register?google_auth=success`,
        redirect: true, // Allow natural redirect flow
      });

      // This code won't execute due to redirect, but keep as fallback
      if (result?.error) {
        console.error("Google sign-up error:", result.error);
        setError("Google sign-up failed. Please try again.");
        showError("Google sign-up failed. Please try again.");
        setGoogleLoading(false);
      }
    } catch (err) {
      console.error("Google sign-up error:", err);
      setError("Google sign-up failed. Please try again.");
      showError("Google sign-up failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate form
    if (!validateForm()) {
      setLoading(false);
      showError("Please fix the errors below");
      return;
    }

    try {
      // Register user
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      // Set user data in context
      setUser({
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
      });

      // Show success message
      showSuccess(
        "Account created successfully! Welcome to Deshi Fresh Bazar!",
      );

      // Redirect to home page after successful registration
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const PasswordRequirement = ({
    met,
    text,
  }: {
    met: boolean;
    text: string;
  }) => (
    <div
      className={`flex items-center gap-2 text-xs ${met ? "text-green-600" : "text-red-600"}`}
    >
      {met ? (
        <CheckCircle className="w-3 h-3" />
      ) : (
        <XCircle className="w-3 h-3" />
      )}
      <span>{text}</span>
    </div>
  );

  return (
    <RootLayout>
      <div className="container py-12">
        <div className="mx-auto max-w-md">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                Create Account
              </CardTitle>
              <CardDescription className="text-gray-600">
                Join us to start shopping fresh products
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Google Sign Up Button */}
              <GoogleSignInButton
                onClick={handleGoogleSignIn}
                loading={googleLoading}
                className="w-full"
                text="Sign up with Google"
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or create account with email
                  </span>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Full Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${
                      validationErrors.name
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {validationErrors.name && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${
                      validationErrors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium"
                  >
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setShowPasswordRequirements(true)}
                      required
                      className={`border-gray-300 focus:border-green-500 focus:ring-green-500 pr-10 ${
                        validationErrors.password
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {validationErrors.password}
                    </p>
                  )}
                  {showPasswordRequirements && (
                    <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                      <p className="text-xs font-medium text-gray-700 mb-2">
                        Password Requirements:
                      </p>
                      <PasswordRequirement
                        met={passwordRequirements.length}
                        text="At least 8 characters"
                      />
                      <PasswordRequirement
                        met={passwordRequirements.uppercase}
                        text="One uppercase letter"
                      />
                      <PasswordRequirement
                        met={passwordRequirements.lowercase}
                        text="One lowercase letter"
                      />
                      <PasswordRequirement
                        met={passwordRequirements.number}
                        text="One number"
                      />
                      <PasswordRequirement
                        met={passwordRequirements.special}
                        text="One special character"
                      />
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-gray-700 font-medium"
                  >
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={`border-gray-300 focus:border-green-500 focus:ring-green-500 pr-10 ${
                        validationErrors.confirmPassword
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                  {formData.confirmPassword &&
                    formData.password === formData.confirmPassword && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Passwords match
                      </p>
                    )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  disabled={
                    loading ||
                    !Object.values(passwordRequirements).every(Boolean)
                  }
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-green-600 hover:text-green-700 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </RootLayout>
  );
}
