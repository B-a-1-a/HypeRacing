"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { auth, onAuthStateChanged, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, isValidConfig } from '../../firebase';
import { initializeUserProfile, getUserProfile } from '../lib/firebase-service';
import { User, Auth } from 'firebase/auth';
import { useRouter } from 'next/navigation';

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
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  isConfigured: boolean;
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
  const router = useRouter();
  
  // Use the isValidConfig flag from Firebase initialization
  // Make sure it's cast as a boolean
  const isConfigured = Boolean(isValidConfig);

  useEffect(() => {
    // Don't try to set up auth listeners if Firebase is not configured
    if (!isConfigured) {
      setLoading(false);
      return () => {};
    }
    
    const unsubscribe = onAuthStateChanged(auth as Auth, async (user) => {
      try {
        setLoading(true);
        
        if (user) {
          setUser(user);
          
          // Initialize user in Firestore if needed and get profile
          await initializeUserProfile(user.uid, user.email || '');
          const userProfile = await getUserProfile(user.uid);
          setProfile(userProfile as UserProfile);
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
  }, [isConfigured]);

  // Sign in function
  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth as Auth, email, password);
      return { success: true };
    } catch (err: any) {
      console.error("Sign in error:", err);
      return { 
        success: false, 
        error: err.message || 'Failed to sign in' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const handleSignUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth as Auth, email, password);
      
      // Initialize user profile in Firestore
      await initializeUserProfile(userCredential.user.uid, email);
      
      return { success: true };
    } catch (err: any) {
      console.error("Sign up error:", err);
      return { 
        success: false, 
        error: err.message || 'Failed to create account' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth as Auth);
      // Redirect to landing page after sign out
      router.push('/');
    } catch (err: any) {
      console.error("Sign out error:", err);
      setError(err.message);
    }
  };

  const value = {
    user,
    profile,
    loading,
    error,
    signOut: handleSignOut,
    signIn: handleSignIn,
    signUp: handleSignUp,
    isConfigured
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