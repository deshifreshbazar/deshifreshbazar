"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/components/ui/toast";

export default function GoogleAuthCallback() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUser();
  const { success: showSuccess, error: showError } = useToast();
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Avoid processing multiple times
      if (processed || status === "loading") return;

      try {
        if (status === "authenticated" && session?.user) {
          // Update user context
          setUser({
            id: session.user.id,
            name: session.user.name || "",
            email: session.user.email || "",
            role: session.user.role as "USER" | "ADMIN",
          });

          // Show appropriate success message
          if (session.user.isNewUser) {
            showSuccess(
              "Account created successfully! Welcome to Deshi Fresh Bazar!",
            );
          } else {
            showSuccess("Login successful! Welcome back!");
          }

          setProcessed(true);

          // Determine redirect destination
          const callbackUrl = searchParams?.get("callbackUrl");
          const defaultUrl = session.user.role === "ADMIN" ? "/admin" : "/";
          const redirectUrl = callbackUrl || defaultUrl;

          // Redirect after showing the message
          setTimeout(() => {
            router.push(redirectUrl);
          }, 1500);
        } else if (status === "unauthenticated") {
          // Authentication failed
          showError("Authentication failed. Please try signing in again.");
          setProcessed(true);

          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      } catch (error) {
        console.error("Error in Google Auth callback:", error);
        showError(
          "Something went wrong during authentication. Please try again.",
        );
        setProcessed(true);

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    };

    handleCallback();
  }, [
    session,
    status,
    processed,
    setUser,
    showSuccess,
    showError,
    router,
    searchParams,
  ]);

  // // Show loading state while processing
  // return (
  //   <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //     <div className="text-center">
  //       <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
  //       <h2 className="text-lg font-semibold text-gray-800 mb-2">
  //         Completing authentication...
  //       </h2>
  //       <p className="text-sm text-gray-600">
  //         Please wait while we set up your account.
  //       </p>
  //     </div>
  //   </div>
  // );
}
