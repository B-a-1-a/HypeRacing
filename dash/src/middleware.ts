import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // We'll implement client-side redirects instead of middleware redirects
  // for authentication state since Firebase Auth state is only available client-side
  return NextResponse.next();
}

// Only run middleware on API routes or other server-protected routes
// Let the client handle auth redirects for pages
export const config = {
  matcher: [
    '/api/:path*'
  ],
}; 