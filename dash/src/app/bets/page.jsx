"use client";

import React from 'react';
import UserPoints from '../../components/UserPoints';
import BetForm from '../../components/BetForm';
import UserBets from '../../components/UserBets';

export default function BetsPage() {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">F1 Betting Dashboard</h1>
      
      <div className="mb-6">
        <UserPoints />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <BetForm />
        </div>
        
        <div className="md:col-span-2">
          <UserBets />
        </div>
      </div>
    </div>
  );
} 