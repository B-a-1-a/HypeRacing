"use client";

import React, { useState, useEffect } from 'react';
import { getOdds, placeBet } from '../lib/firebase-service';
import useAuth from '../hooks/useAuth';

export default function BetForm() {
  const { user, profile } = useAuth();
  const [oddsData, setOddsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [betAmount, setBetAmount] = useState(10);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentOdds, setCurrentOdds] = useState(0);

  useEffect(() => {
    async function loadOdds() {
      try {
        setLoading(true);
        const odds = await getOdds();
        if (odds && odds.data) {
          setOddsData(odds.data);
        }
      } catch (err) {
        console.error("Error loading odds:", err);
        setError("Failed to load odds data");
      } finally {
        setLoading(false);
      }
    }

    loadOdds();
  }, []);

  useEffect(() => {
    if (selectedDriver && selectedPosition && oddsData && oddsData[selectedDriver]) {
      setCurrentOdds(oddsData[selectedDriver][selectedPosition]);
    } else {
      setCurrentOdds(0);
    }
  }, [selectedDriver, selectedPosition, oddsData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('You must be logged in to place a bet');
      return;
    }

    if (!selectedDriver) {
      setError('Please select a driver');
      return;
    }

    if (!selectedPosition) {
      setError('Please select a position');
      return;
    }

    if (betAmount <= 0) {
      setError('Bet amount must be greater than 0');
      return;
    }

    if (profile && betAmount > profile.points) {
      setError('Not enough points');
      return;
    }

    try {
      await placeBet(user.uid, {
        driver: selectedDriver,
        position: selectedPosition,
        amount: parseInt(betAmount, 10),
        odds: currentOdds,
      });

      setSuccess('Bet placed successfully!');
      setBetAmount(10);
      setSelectedDriver('');
      setSelectedPosition('');
    } catch (err) {
      console.error("Error placing bet:", err);
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="p-4">Loading odds data...</div>;
  }

  if (!oddsData) {
    return <div className="p-4">No odds data available</div>;
  }

  const drivers = Object.keys(oddsData);
  const positions = oddsData[drivers[0]] ? Object.keys(oddsData[drivers[0]]) : [];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Place a Bet</h2>
      
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Select Driver</label>
          <select 
            className="w-full p-2 border rounded"
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
          >
            <option value="">Select a driver</option>
            {drivers.map(driver => (
              <option key={driver} value={driver}>{driver}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Select Position</label>
          <select 
            className="w-full p-2 border rounded"
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            disabled={!selectedDriver}
          >
            <option value="">Select a position</option>
            {positions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Bet Amount</label>
          <input 
            type="number" 
            className="w-full p-2 border rounded"
            min="1"
            max={profile ? profile.points : 1000}
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
          />
          {profile && (
            <p className="text-sm text-gray-600 mt-1">Available: {profile.points} points</p>
          )}
        </div>
        
        {currentOdds > 0 && (
          <div className="mb-4 p-2 bg-gray-100 rounded">
            <p className="font-semibold">Current Odds: {currentOdds}</p>
            <p>Potential Winnings: {(betAmount * currentOdds).toFixed(2)} points</p>
          </div>
        )}
        
        <button 
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={!selectedDriver || !selectedPosition || betAmount <= 0 || (profile && betAmount > profile.points)}
        >
          Place Bet
        </button>
      </form>
    </div>
  );
} 