'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useAuth from '@/hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, loading, isConfigured } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isConfigured) {
      setError('Firebase authentication is not configured. Please check your environment variables.');
      return;
    }
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const result = await signIn(email, password);
    if (!result.success) {
      setError(result.error || 'Failed to sign in');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <span className="text-xl font-bold">HypeRacing</span>
        </Link>
        
        <div className="w-full max-w-md space-y-8 bg-zinc-950 p-8 rounded-xl border border-zinc-800">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Sign In</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Welcome back! Please enter your details.
            </p>
          </div>
          
          {!isConfigured && (
            <div className="bg-red-900/30 border border-red-700 text-white p-3 rounded-md">
              <p className="text-sm">
                <strong>Configuration Error:</strong> Firebase authentication is not properly configured. 
                Please check your environment variables.
              </p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-white p-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-800 bg-zinc-900 rounded-md focus:border-cyan-500 focus:ring-cyan-500"
                placeholder="your@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Link href="#" className="text-sm text-cyan-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-800 bg-zinc-900 rounded-md focus:border-cyan-500 focus:ring-cyan-500"
                placeholder="********"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !isConfigured}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-medium py-2 px-4 rounded-md disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <div className="text-center text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="text-cyan-400 hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 