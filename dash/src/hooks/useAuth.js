"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth, onAuthStateChanged } from '../../firebase';
import { initializeUserProfile, getUserProfile } from '../lib/firebase-service';

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        
        if (user) {
          setUser(user);
          
          // Initialize user in Firestore if needed and get profile
          await initializeUserProfile(user.uid, user.email);
          const userProfile = await getUserProfile(user.uid);
          setProfile(userProfile);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
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
export default function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 