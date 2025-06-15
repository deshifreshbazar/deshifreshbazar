"use client";

import { deleteCookie } from '@/utils/cookies'; // adjust path as needed


import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN'; // Add this line to match your Prisma schema
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for user data in localStorage on initial load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

 // adjust path as needed

  const logout = () => {
    // Clear both localStorage and cookie
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    deleteCookie('token'); // removes cookie
  
    setUser(null);
  };
  

  const value = {
    user,
    setUser: (newUser: User | null) => {
      if (newUser) {
        localStorage.setItem("user", JSON.stringify(newUser));
      }
      setUser(newUser);
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