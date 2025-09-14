
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, allUsers, findUserById } from '@/lib/users';
import { useRouter } from 'next/navigation';

const AUTH_STORAGE_KEY = 'currentUser';

type AuthProviderState = {
  currentUser: User | null;
  login: (userId: string) => void;
  logout: () => void;
};

const AuthProviderContext = createContext<AuthProviderState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUserId = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUserId) {
        const user = findUserById(storedUserId);
        setCurrentUser(user || null);
      } else {
        // Default to Admin user if no one is logged in
        const adminUser = allUsers.find(u => u.role === 'Admin');
        if (adminUser) {
            setCurrentUser(adminUser);
            localStorage.setItem(AUTH_STORAGE_KEY, adminUser.id);
        }
      }
    } catch (error) {
      console.error("Failed to access localStorage for auth:", error);
       // Default to Admin user if localStorage fails
       const adminUser = allUsers.find(u => u.role === 'Admin');
       if (adminUser) {
           setCurrentUser(adminUser);
       }
    }
  }, []);

  const login = useCallback((userId: string) => {
    const user = findUserById(userId);
    if (user) {
      setCurrentUser(user);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, userId);
      } catch (error) {
        console.error("Failed to save user to localStorage:", error);
      }
      router.push('/dashboard');
    }
  }, [router]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to remove user from localStorage:", error);
    }
    // Set admin as default after logout
    const adminUser = allUsers.find(u => u.role === 'Admin');
    if (adminUser) {
        setCurrentUser(adminUser);
        localStorage.setItem(AUTH_STORAGE_KEY, adminUser.id);
    }
    router.push('/users');
  }, [router]);

  const value = { currentUser, login, logout };

  return (
    <AuthProviderContext.Provider value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthProviderContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
