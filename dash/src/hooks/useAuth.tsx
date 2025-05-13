"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { auth, onAuthStateChanged } from '../../firebase';
import { initializeUserProfile, getUserProfile } from '../lib/firebase-service';
import { User } from 'firebase/auth';

// Define types for our context
export interface UserProfile {
  id: string;
  email: string;
  points: number;
  createdAt: any;
  updatedAt: any;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

// Create Auth Context with proper type
const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        
        if (user) {
          setUser(user);
          
          // Initialize user in Firestore if needed and get profile
          await initializeUserProfile(user.uid, user.email || '');
          const userProfile = await getUserProfile(user.uid);
          setProfile(userProfile);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err: any) {
        console.error("Auth error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use Auth Context
export default function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 