'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

// Define routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup'];

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isConfigured } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  
  useEffect(() => {
    // Don't do anything while auth is loading
    if (loading) return;
    
    // Don't restrict navigation if Firebase isn't configured
    if (!isConfigured) {
      console.log('Firebase not configured, skipping route protection');
      return;
    }
    
    const isPublicRoute = publicRoutes.includes(pathname);
    
    // If user is authenticated and trying to access public routes
    if (user && isPublicRoute) {
      console.log('Authenticated user trying to access public route, redirecting to dashboard');
      router.push('/dashboard');
    }
    
    // If user is not authenticated and trying to access protected routes
    if (!user && !isPublicRoute) {
      console.log('Unauthenticated user trying to access protected route, redirecting to landing page');
      router.push('/');
    }
  }, [user, loading, pathname, router, isConfigured]);
  
  return <>{children}</>;
} 