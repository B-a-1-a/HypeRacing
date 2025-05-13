"use client";

import React from 'react';
import useAuth from '../hooks/useAuth';

export default function UserPoints() {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">Loading...</div>;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
      <div className="font-semibold">Your Points</div>
      <div className="text-xl font-bold">{profile.points.toLocaleString()}</div>
    </div>
  );
} 