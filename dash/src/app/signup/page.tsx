'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useAuth from '@/hooks/useAuth';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { signUp, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the terms of service and privacy policy');
      return;
    }

    const result = await signUp(email, password);
    if (!result.success) {
      setError(result.error || 'Failed to create account');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <span className="text-xl font-bold">HypeRacing</span>
        </Link>
        <div className="w-full max-w-md space-y-6 rounded-lg border border-zinc-800 bg-zinc-950 p-6 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-zinc-400">Enter your information to create an account</p>
          </div>
          
          {error && (
            <div className="p-4 bg-red-950/50 text-red-400 rounded-md text-sm border border-red-900/50">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-800 bg-zinc-900 rounded-md focus:border-cyan-500 focus:ring-cyan-500"
                placeholder="m@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-800 bg-zinc-900 rounded-md focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-800 bg-zinc-900 rounded-md focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-700 text-cyan-500 focus:ring-cyan-500"
              />
              <label htmlFor="terms" className="text-sm text-zinc-400">
                I agree to the{" "}
                <Link href="#" className="text-cyan-400 hover:underline">
                  terms of service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-cyan-400 hover:underline">
                  privacy policy
                </Link>
              </label>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-medium py-2 px-4 rounded-md disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-cyan-400 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 