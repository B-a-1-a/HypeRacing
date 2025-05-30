'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from '../../firebase';
import { User as FirebaseUser, Auth } from 'firebase/auth';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isConfigured: boolean;
}

// Check if Firebase is properly configured
const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID
);

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ success: false, error: 'Firebase is not configured' }),
  signUp: async () => ({ success: false, error: 'Firebase is not configured' }),
  signOut: async () => {},
  isConfigured: isFirebaseConfigured
});

// Set auth token in cookies for middleware
const setAuthCookie = (token: string | null) => {
  if (token) {
    Cookies.set('auth-token', token, { expires: 7 }); // 7 days expiry
  } else {
    Cookies.remove('auth-token');
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Listen for auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return () => {};
    }
    
    const unsubscribe = onAuthStateChanged(auth as Auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Get the ID token and set it in cookies
        const token = await currentUser.getIdToken();
        setAuthCookie(token);
      } else {
        // Clear the auth cookie when user is signed out
        setAuthCookie(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      return { 
        success: false, 
        error: 'Firebase authentication is not configured. Please check your environment variables.' 
      };
    }
    
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth as Auth, email, password);
      const token = await userCredential.user.getIdToken();
      setAuthCookie(token);
      router.push('/dashboard');
      return { success: true };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to sign in'
      };
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      return { 
        success: false, 
        error: 'Firebase authentication is not configured. Please check your environment variables.' 
      };
    }
    
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth as Auth, email, password);
      const token = await userCredential.user.getIdToken();
      setAuthCookie(token);
      router.push('/dashboard');
      return { success: true };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to create account'
      };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    if (!isFirebaseConfigured) {
      router.push('/login');
      return;
    }
    
    try {
      await firebaseSignOut(auth as Auth);
      setAuthCookie(null);
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      isConfigured: isFirebaseConfigured
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default useAuth; 