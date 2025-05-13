"use client";

import React, { useState, useEffect } from 'react';
import { getUserBets } from '../lib/firebase-service';
import useAuth from '../hooks/useAuth';

export default function UserBets() {
  const { user } = useAuth();
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadBets() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userBets = await getUserBets(user.uid);
        setBets(userBets);
      } catch (err) {
        console.error("Error loading bets:", err);
        setError("Failed to load your bets");
      } finally {
        setLoading(false);
      }
    }

    loadBets();
  }, [user]);

  if (loading) {
    return <div className="p-4">Loading your bets...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!user) {
    return <div className="p-4">Please log in to view your bets</div>;
  }

  if (bets.length === 0) {
    return <div className="p-4">You haven't placed any bets yet</div>;
  }

  // Sort bets by creation date (newest first)
  const sortedBets = [...bets].sort((a, b) => {
    return new Date(b.createdAt?.toDate()) - new Date(a.createdAt?.toDate());
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Your Bets</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Driver</th>
              <th className="py-2 px-4 text-left">Position</th>
              <th className="py-2 px-4 text-right">Amount</th>
              <th className="py-2 px-4 text-right">Odds</th>
              <th className="py-2 px-4 text-right">Potential Win</th>
              <th className="py-2 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedBets.map((bet) => (
              <tr key={bet.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">
                  {bet.createdAt?.toDate 
                    ? bet.createdAt.toDate().toLocaleDateString() 
                    : 'Unknown date'}
                </td>
                <td className="py-2 px-4">{bet.driver}</td>
                <td className="py-2 px-4">{bet.position}</td>
                <td className="py-2 px-4 text-right">{bet.amount}</td>
                <td className="py-2 px-4 text-right">{bet.odds.toFixed(2)}</td>
                <td className="py-2 px-4 text-right">{bet.potentialWinnings.toFixed(2)}</td>
                <td className="py-2 px-4 text-center">
                  <span className={`px-2 py-1 rounded text-sm ${
                    bet.status === 'won' 
                      ? 'bg-green-100 text-green-800' 
                      : bet.status === 'lost' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 