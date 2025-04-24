'use client';

import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { User } from 'firebase/auth';

export default function ProfileMenu() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleSignOut = async () => {
    await signOut();
    closeMenu();
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        <span className="sr-only">Open user menu</span>
        <div className="h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center text-black">
          {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-1 bg-zinc-950 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 border border-zinc-800">
          <div className="px-4 py-2 text-sm text-white border-b border-zinc-800">
            <p className="font-medium truncate">{user.email}</p>
          </div>
          
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-900"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
} 