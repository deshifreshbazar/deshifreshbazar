"use client";

import { deleteCookie } from '@/utils/cookies';
import { normalizeImageUrl } from "@/lib/supabase-storage";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  image?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function normalizeUser(user: User): User {
  return {
    ...user,
    image: normalizeImageUrl(user.image),
  };
}

function parseStoredUser(rawUser: string): User | null {
  try {
    const parsed = JSON.parse(rawUser) as User;
    if (!parsed?.id || !parsed?.email || !parsed?.name) return null;
    return normalizeUser(parsed);
  } catch {
    return null;
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = parseStoredUser(storedUser);
      if (parsedUser) {
        setUser(parsedUser);
        localStorage.setItem("user", JSON.stringify(parsedUser));
      } else {
        localStorage.removeItem("user");
      }
    }

    const syncFromSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok) return;
        const session = await response.json();
        const sessionUser = session?.user;
        if (!sessionUser?.id || !sessionUser?.email || !sessionUser?.name) return;
        const nextUser: User = normalizeUser({
          id: sessionUser.id,
          name: sessionUser.name,
          email: sessionUser.email,
          role: sessionUser.role === "ADMIN" ? "ADMIN" : "USER",
          image: sessionUser.image,
        });
        setUser(nextUser);
        localStorage.setItem("user", JSON.stringify(nextUser));
      } catch {
        return;
      }
    };

    syncFromSession();
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    deleteCookie('token');
  
    setUser(null);
  };
  

  const value = {
    user,
    setUser: (newUser: User | null) => {
      if (newUser) {
        const normalizedUser = normalizeUser(newUser);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        setUser(normalizedUser);
        return;
      }
      localStorage.removeItem("user");
      setUser(null);
    },
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
