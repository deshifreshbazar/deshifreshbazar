import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import { compare, hash } from "bcryptjs";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  id: string;
  name: string;
  email: string;
  token: string;
  role: "USER" | "ADMIN";
}

// Helper function to set cookie
function setCookie(name: string, value: string, days: number) {
  if (typeof window !== "undefined") {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }
}

// Helper function to get cookie
function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "GOCSPX-dummy-secret", // Fallback for development
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          // Add mobile-friendly parameters
          display: "popup",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Create new user for Google sign-in
            const newUser = await prisma.user.create({
              data: {
                name: user.name!,
                email: user.email!,
                password: await hash("google-auth-" + user.id, 12), // Dummy password for Google users
                role: "USER",
              },
            });
            // Mark user as new for downstream callbacks
            user.id = newUser.id;
            user.role = newUser.role;
            user.isNewUser = true;
            console.log("New Google user created:", newUser.email);
          } else {
            user.id = existingUser.id;
            user.role = existingUser.role;
            user.isNewUser = false;
            console.log("Existing Google user signed in:", existingUser.email);
          }
          return true;
        } catch (error) {
          console.error("Error creating/finding Google user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Get user from database to ensure we have the latest data
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser.id;
          // Propagate isNewUser if set by signIn callback
          if (typeof user.isNewUser !== "undefined") {
            token.isNewUser = user.isNewUser;
          } else if (typeof token.isNewUser === "undefined") {
            token.isNewUser = false;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        session.user.isNewUser = token.isNewUser as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.JWT_SECRET,
};

// Extend next-auth types
declare module "next-auth" {
  interface User {
    role: string;
    id: string;
    isNewUser?: boolean;
  }

  interface Session {
    user: User & {
      role: string;
      id: string;
      isNewUser?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    id: string;
    isNewUser?: boolean;
  }
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch("/api/users", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  const result = await response.json();

  // Store token in cookie
  setCookie("token", result.token, 30); // 30 days expiry

  return result;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  const result = await response.json();

  // Store token in cookie
  setCookie("token", result.token, 30); // 30 days expiry

  return result;
}

export async function logout() {
  // Remove token from cookie
  setCookie("token", "", -1); // Set expiry to past date to remove cookie
}

export async function getCurrentUser() {
  const token = getCookie("token");

  if (!token) {
    return null;
  }

  const response = await fetch("/api/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      return null; // Not logged in
    }
    const error = await response.json();
    throw new Error(error.message || "Failed to get user profile");
  }

  return response.json();
}

export function isAuthenticated(): boolean {
  return !!getCookie("token");
}
