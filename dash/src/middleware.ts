import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/signup' || path === '/';
  
  // Check for auth cookie/token
  const token = request.cookies.get('auth-token')?.value || '';
  
  // Redirect logic
  if (isPublicPath && token) {
    // If user is authenticated and trying to access public paths (login/signup),
    // redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (!isPublicPath && !token) {
    // If user is not authenticated and trying to access protected routes,
    // redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// Configure which paths should be protected by this middleware
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/dashboard/:path*'
  ],
}; 