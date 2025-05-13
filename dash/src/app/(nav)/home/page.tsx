"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import useAuth from "../../../hooks/useAuth"
import { getOdds, placeBet, getUserBets } from "../../../lib/firebase-service"
import { UserProfile } from "../../../hooks/useAuth"

interface Driver {
  code: string
  name: string
  team: string
  points: number
}

interface Constructor {
  name: string
  logo: string
  points: number
}

interface RaceData {
  code: string
  lapTime: string
  gap: string
}

interface Bet {
  id: string
  driver: string
  position: string
  amount: number
  odds: number
  potentialWinnings: number
  status: string
  createdAt: {
    toDate: () => Date
  }
}

export default function HomePage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [selectedDriver, setSelectedDriver] = useState("")
  const [selectedPosition, setSelectedPosition] = useState("")
  const [betAmount, setBetAmount] = useState(10)
  const [showOdds, setShowOdds] = useState(false)
  const [oddsList, setOddsList] = useState<Record<string, number[][]>>({})
  const [firebaseOdds, setFirebaseOdds] = useState<any>(null)
  const [loadingOdds, setLoadingOdds] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentOdds, setCurrentOdds] = useState(0)
  const [userBets, setUserBets] = useState<Bet[]>([])
  const [loadingBets, setLoadingBets] = useState(true)

  // F1 Drivers data
  const drivers: Driver[] = [
    { code: "PIA", name: "Oscar Piastri", team: "McLaren", points: 90 },
    { code: "NOR", name: "Lando Norris", team: "McLaren", points: 51 },
    { code: "VER", name: "Max Verstappen", team: "Red Bull Racing", points: 77 },
    { code: "LEC", name: "Charles Leclerc", team: "Ferrari", points: 80 },
    { code: "SAI", name: "Carlos Sainz", team: "Ferrari", points: 68 },
    { code: "HAM", name: "Lewis Hamilton", team: "Mercedes", points: 64 },
    { code: "RUS", name: "George Russell", team: "Mercedes", points: 59 },
    { code: "PER", name: "Sergio Perez", team: "Red Bull Racing", points: 48 },
    { code: "ALO", name: "Fernando Alonso", team: "Aston Martin", points: 45 },
    { code: "STR", name: "Lance Stroll", team: "Aston Martin", points: 23 },
    { code: "TSU", name: "Yuki Tsunoda", team: "RB", points: 20 },
    { code: "HUL", name: "Nico Hulkenberg", team: "Haas", points: 16 },
    { code: "RIC", name: "Daniel Ricciardo", team: "RB", points: 12 },
    { code: "ALB", name: "Alexander Albon", team: "Williams", points: 8 },
    { code: "MAG", name: "Kevin Magnussen", team: "Haas", points: 6 },
    { code: "OCO", name: "Esteban Ocon", team: "Alpine", points: 4 },
    { code: "GAS", name: "Pierre Gasly", team: "Alpine", points: 3 },
    { code: "SAR", name: "Logan Sargeant", team: "Williams", points: 0 },
    { code: "BOT", name: "Valtteri Bottas", team: "Sauber", points: 0 },
    { code: "ZHO", name: "Zhou Guanyu", team: "Sauber", points: 0 },
  ]

  // Constructor standings
  const constructors: Constructor[] = [
    { name: "McLaren", logo: "McLaren", points: 170 },
    { name: "Mercedes-AMG", logo: "Mercedes", points: 170 },
    { name: "Scuderia Ferrari", logo: "Ferrari", points: 109 },
    { name: "Red Bull Racing", logo: "RedBull", points: 105 },
    { name: "Aston Martin", logo: "Aston Martin", points: 68 },
    { name: "RB", logo: "RB", points: 32 },
    { name: "Haas F1 Team", logo: "Haas", points: 22 },
    { name: "Williams Racing", logo: "Williams", points: 8 },
    { name: "Alpine F1 Team", logo: "Alpine", points: 7 },
    { name: "Stake F1 Team Sauber", logo: "Sauber", points: 0 },
  ]

  // Race data for dashboard snippet
  const raceData: RaceData[] = [
    { code: "PIA", lapTime: "1:26.91", gap: "LEADER" },
    { code: "NOR", lapTime: "1:27.04", gap: "+0.13s" },
    { code: "LEC", lapTime: "1:27.18", gap: "+0.27s" },
    { code: "RUS", lapTime: "1:27.32", gap: "+0.41s" },
    { code: "VER", lapTime: "1:27.45", gap: "+0.54s" },
  ]

  // Load Firebase odds
  useEffect(() => {
    async function loadOdds() {
      try {
        setLoadingOdds(true);
        const odds = await getOdds();
        if (odds && odds.data) {
          setFirebaseOdds(odds.data);
        }
      } catch (err) {
        console.error("Error loading odds:", err);
        setError("Failed to load odds data");
      } finally {
        setLoadingOdds(false);
      }
    }

    loadOdds();
  }, []);

  // Load user bets
  useEffect(() => {
    async function loadBets() {
      if (!user) {
        setLoadingBets(false);
        return;
      }

      try {
        setLoadingBets(true);
        const userBets = await getUserBets(user.uid);
        setUserBets(userBets);
      } catch (err) {
        console.error("Error loading bets:", err);
        setError("Failed to load your bets");
      } finally {
        setLoadingBets(false);
      }
    }

    loadBets();
  }, [user, success]);

  // Generate consistent odds for positions
  useEffect(() => {
    // If Firebase odds are available, don't use the generated odds
    if (firebaseOdds) return;
    
    // Generate fixed odds only once on the client side
    const generateFixedOdds = () => {
      const result: Record<string, number[][]> = {};
      
      drivers.forEach((driver) => {
        // Create consistent odds for each driver
        const driverIndex = drivers.findIndex((d) => d.code === driver.code);
        const baseOdds = driverIndex < 5 ? 2.5 : driverIndex < 10 ? 5 : 10;
        
        // For positions P1-P7 shown in the table
        const tableOdds = Array.from({ length: 7 }, (_, i) => {
          const position = i + 1;
          const difference = Math.abs(position - (driverIndex + 1));
          const multiplier = difference === 0 ? 1 : 1 + difference * 0.5;
          // Use driver code and position to create a deterministic "random" factor
          const seed = (driver.code.charCodeAt(0) + position) % 40 / 100 + 0.8; // 0.8 to 1.2
          return parseFloat((baseOdds * multiplier * seed).toFixed(1));
        });
        
        // For the odds selection grid (P1-P20)
        const allOdds = Array.from({ length: 20 }, (_, i) => {
          const position = i + 1;
          const difference = Math.abs(position - (driverIndex + 1));
          const multiplier = difference === 0 ? 1 : 1 + difference * 0.5;
          // Use driver code and position to create a deterministic "random" factor
          const seed = (driver.code.charCodeAt(0) + position) % 40 / 100 + 0.8; // 0.8 to 1.2
          return parseFloat((baseOdds * multiplier * seed).toFixed(1));
        });
        
        result[driver.code] = [tableOdds, allOdds];
      });
      
      return result;
    };
    
    setOddsList(generateFixedOdds());
  }, [firebaseOdds]);

  // Update current odds when selection changes
  useEffect(() => {
    if (selectedDriver && selectedPosition) {
      if (firebaseOdds && firebaseOdds[selectedDriver]) {
        setCurrentOdds(firebaseOdds[selectedDriver][selectedPosition]);
      } else if (oddsList[selectedDriver]) {
        const positionIndex = parseInt(selectedPosition.substring(1)) - 1;
        setCurrentOdds(oddsList[selectedDriver][1][positionIndex]);
      }
    } else {
      setCurrentOdds(0);
    }
  }, [selectedDriver, selectedPosition, firebaseOdds, oddsList]);

  // Handle driver selection
  const handleDriverSelect = (driverCode: string) => {
    setSelectedDriver(driverCode)
    setSelectedPosition("")
    setShowOdds(true)
  }

  // Check if HYPE button should be enabled
  const isHypeEnabled = selectedDriver && selectedPosition && betAmount > 0 && (!profile || betAmount <= profile.points);

  // Handle HYPE button click (place bet)
  const handleHypeClick = async () => {
    if (!isHypeEnabled) return;
    
    setError('');
    setSuccess('');

    if (!user) {
      setError('You must be logged in to place a bet');
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
        amount: parseInt(betAmount.toString(), 10),
        odds: currentOdds,
      });

      setSuccess('Bet placed successfully!');
      setBetAmount(10);
      setSelectedDriver('');
      setSelectedPosition('');
      setShowOdds(false);
    } catch (err: any) {
      console.error("Error placing bet:", err);
      setError(err.message);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header with Logo and Navigation */}
      <header className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          {/* Logo */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-4xl font-bold">
              <span className="text-white">Hype</span>
              <span className="text-cyan-400">Racing</span>
            </div>
            
            {/* User Points */}
            {!authLoading && profile && (
              <div className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-800">
                <div className="text-sm text-gray-400">Your HypePoints</div>
                <div className="text-xl font-bold text-cyan-400">{profile.points.toLocaleString()}</div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* HYPE Betting Section */}
        <div className="mb-8 bg-gray-900 rounded-lg shadow-md p-6 border border-gray-800">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-4">
              <span className="text-white">HYPE</span> <span className="text-cyan-400">Betting</span>
            </h2>
            {error && <div className="mb-4 p-2 bg-red-900/50 text-red-200 rounded">{error}</div>}
            {success && <div className="mb-4 p-2 bg-green-900/50 text-green-200 rounded">{success}</div>}
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-1/3">
              <div className="relative">
                <select
                  className="w-full p-3 border border-gray-700 rounded-md appearance-none bg-gray-800 text-white pr-10"
                  value={selectedDriver}
                  onChange={(e) => handleDriverSelect(e.target.value)}
                  disabled={loadingOdds}
                >
                  <option value="">Select Driver</option>
                  {loadingOdds ? (
                    <option disabled>Loading drivers...</option>
                  ) : (
                    (firebaseOdds ? Object.keys(firebaseOdds) : drivers.map(d => d.code)).map((driverCode) => {
                      const driver = drivers.find(d => d.code === driverCode);
                      return (
                        <option key={driverCode} value={driverCode}>
                          {driver ? `${driver.name} (${driverCode})` : driverCode}
                        </option>
                      );
                    })
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="w-full md:w-1/3">
              <div className="text-center">
                <input 
                  type="number" 
                  className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-white text-center"
                  min="1"
                  max={profile ? profile.points : 1000}
                  value={betAmount}
                  disabled={!selectedDriver || !selectedPosition}
                  onChange={(e) => setBetAmount(parseInt(e.target.value, 10))}
                  placeholder="Bet Amount"
                />
                {profile && selectedDriver && selectedPosition && (
                  <p className="text-sm text-gray-400 mt-1">Available: {profile.points} points</p>
                )}

                {currentOdds > 0 && (
                  <div className="mt-2 p-2 bg-gray-800/50 rounded">
                    <p className="font-semibold text-cyan-400">Odds: {currentOdds.toFixed(2)}</p>
                    <p className="text-white">Potential Win: {(betAmount * currentOdds).toFixed(2)} points</p>
                  </div>
                )}
              </div>
            </div>

            <button
              className={`bg-cyan-500 text-black font-bold py-3 px-8 rounded-md shadow-lg transform transition ${
                isHypeEnabled ? "hover:bg-cyan-400 hover:scale-105" : "opacity-50 cursor-not-allowed"
              }`}
              onClick={handleHypeClick}
              disabled={!isHypeEnabled}
            >
              HYPE
            </button>
          </div>

          <div className="w-full mt-4">
            {showOdds && selectedDriver && (
              <div className="text-center">
                <p className="font-bold text-white mb-2">Select Position</p>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 20 }, (_, i) => {
                    const position = `P${i + 1}`;
                    const odd = firebaseOdds ? 
                      firebaseOdds[selectedDriver]?.[position] : 
                      oddsList[selectedDriver]?.[1][i];
                    
                    return (
                      <div
                        key={position}
                        className={`text-center p-2 rounded cursor-pointer transition-all ${
                          selectedPosition === position
                            ? "bg-cyan-500 text-black font-bold"
                            : "bg-gray-800 hover:bg-gray-700"
                        }`}
                        onClick={() => setSelectedPosition(position)}
                      >
                        <div className="text-xs">{position}</div>
                        <div className="font-bold">{odd ? odd.toFixed(1) : '-'}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Previous Bets Section */}
        {user && (
          <div className="mb-8 bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-800">
            <div className="bg-black text-white py-3 px-4 font-bold border-b border-gray-800">
              Your Previous Bets
            </div>
            <div className="p-4 overflow-x-auto">
              {loadingBets ? (
                <div className="text-center p-4">Loading your bets...</div>
              ) : userBets.length === 0 ? (
                <div className="text-center p-4">You haven't placed any bets yet</div>
              ) : (
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="py-2 px-4 text-left text-gray-400">Date</th>
                      <th className="py-2 px-4 text-left text-gray-400">Driver</th>
                      <th className="py-2 px-4 text-left text-gray-400">Position</th>
                      <th className="py-2 px-4 text-right text-gray-400">Amount</th>
                      <th className="py-2 px-4 text-right text-gray-400">Odds</th>
                      <th className="py-2 px-4 text-right text-gray-400">Potential Win</th>
                      <th className="py-2 px-4 text-center text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userBets
                      .sort((a, b) => {
                        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date();
                        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date();
                        return dateB.getTime() - dateA.getTime();
                      })
                      .slice(0, 5) // Show only the 5 most recent bets
                      .map((bet) => (
                        <tr key={bet.id} className="border-b border-gray-800">
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
                                ? 'bg-green-900/50 text-green-200' 
                                : bet.status === 'lost' 
                                  ? 'bg-red-900/50 text-red-200' 
                                  : 'bg-yellow-900/50 text-yellow-200'
                            }`}>
                              {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Three Panel Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Constructor Standings Panel */}
          <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-800">
            <div className="bg-black text-white py-3 px-4 font-bold border-b border-gray-800">
              Constructor Standings
            </div>
            <div className="p-4">
              <table className="w-full">
                <tbody>
                  {constructors.slice(0, 10).map((constructor, index) => (
                    <tr key={index} className={index < 9 ? "border-b border-gray-800" : ""}>
                      <td className="py-2 flex items-center">
                        <span className="w-6 text-gray-500">{index + 1}</span>
                        {constructor.logo && (
                          <span className="w-6 h-6 mr-2 flex items-center justify-center">
                            {constructor.logo === "Ferrari" && <span className="text-red-600">●</span>}
                            {constructor.logo === "McLaren" && <span className="text-orange-500">●</span>}
                            {constructor.logo === "Mercedes" && <span className="text-teal-500">●</span>}
                            {constructor.logo === "RedBull" && <span className="text-blue-600">●</span>}
                            {constructor.logo === "AstonMartin" && <span className="text-green-600">●</span>}
                            {constructor.logo === "Alpine" && <span className="text-pink-500">●</span>}
                            {constructor.logo === "Williams" && <span className="text-blue-800">●</span>}
                            {constructor.logo === "RB" && <span className="text-purple-600">●</span>}
                            {constructor.logo === "Haas" && <span className="text-gray-600">●</span>}
                            {constructor.logo === "Sauber" && <span className="text-green-400">●</span>}
                          </span>
                        )}
                        <span className="font-medium">{constructor.name}</span>
                      </td>
                      <td className="py-2 text-right font-bold">{constructor.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dashboard Snippet Panel */}
          <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-800">
            <div className="bg-black text-white py-3 px-4 font-bold border-b border-gray-800">Live Race Data</div>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-2 text-gray-400 font-medium">Driver</th>
                    <th className="text-left py-2 text-gray-400 font-medium">Lap Time</th>
                    <th className="text-right py-2 text-gray-400 font-medium">Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {raceData.map((driver, index) => (
                    <tr key={index} className={index < raceData.length - 1 ? "border-b border-gray-800" : ""}>
                      <td className="py-3">
                        <span className="font-bold">{driver.code}</span>
                      </td>
                      <td className="py-3 font-mono">{driver.lapTime}</td>
                      <td className="py-3 text-right text-gray-400">{driver.gap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Driver Standings Panel */}
          <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-800">
            <div className="bg-black text-white py-3 px-4 font-bold border-b border-gray-800">Driver Standings</div>
            <div className="p-4">
              <table className="w-full">
                <tbody>
                  {drivers.slice(0, 10).map((driver, index) => (
                    <tr key={index} className={index < 9 ? "border-b border-gray-800" : ""}>
                      <td className="py-2 flex items-center">
                        <span className="w-6 text-gray-500">{index + 1}</span>
                        <span className="font-medium">{driver.name}</span>
                      </td>
                      <td className="py-2 text-right font-bold">{driver.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* HYPE Odds Panel */}
        <div className="mt-6 bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-800">
          <div className="bg-black text-white py-3 px-4 font-bold border-b border-gray-800">
            <span className="text-white">HYPE</span> <span className="text-cyan-400">Odds</span>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-2 text-gray-400 font-medium">Driver</th>
                  <th className="text-center py-2 text-gray-400 font-medium">P1</th>
                  <th className="text-center py-2 text-gray-400 font-medium">P2</th>
                  <th className="text-center py-2 text-gray-400 font-medium">P3</th>
                  <th className="text-center py-2 text-gray-400 font-medium">P4</th>
                  <th className="text-center py-2 text-gray-400 font-medium">P5</th>
                  <th className="text-center py-2 text-gray-400 font-medium">P6</th>
                  <th className="text-center py-2 text-gray-400 font-medium">P7</th>
                </tr>
              </thead>
              <tbody>
                {(firebaseOdds ? Object.keys(firebaseOdds) : drivers.map(d => d.code)).slice(0, 6).map((driverCode, index) => {
                  const tableOdds = firebaseOdds ? 
                    Array.from({ length: 7 }, (_, i) => firebaseOdds[driverCode][`P${i+1}`]) :
                    oddsList[driverCode]?.[0] || [];
                  
                  return (
                    <tr key={index} className={index < 5 ? "border-b border-gray-800" : ""}>
                      <td className="py-3 font-bold">{driverCode}</td>
                      {tableOdds.map((odd, i) => (
                        <td key={i} className="py-3 text-center">
                          <span className="text-cyan-400">{odd !== undefined ? odd.toFixed(1) : '-'}</span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-6 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 <span className="text-white">Hype</span>
            <span className="text-cyan-400">Racing</span> - Data-Driven Motorsports Betting
          </p>
        </div>
      </footer>

      <style jsx global>{`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        :root {
          --foreground-rgb: 255, 255, 255;
          --background-rgb: 0, 0, 0;
          --accent-rgb: 45, 212, 191;
        }

        body {
          color: rgb(var(--foreground-rgb));
          background: rgb(var(--background-rgb));
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #111;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #444;
        }

        /* Custom styles for the motorsports app */
        .driver-code {
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 4px;
          background-color: #222;
        }

        .sector-bar {
          height: 4px;
          background-color: #333;
          border-radius: 2px;
          overflow: hidden;
          margin-right: 6px;
        }

        .sector-bar-fill {
          height: 100%;
          border-radius: 2px;
        }

        .sector-fast {
          background-color: #4caf50;
        }

        .sector-medium {
          background-color: #ffc107;
        }

        .sector-slow {
          background-color: #ff5722;
        }

        .team-color-ferrari {
          color: #ff2800;
        }

        .team-color-mclaren {
          color: #ff8700;
        }

        .team-color-mercedes {
          color: #00d2be;
        }

        .team-color-redbull {
          color: #0600ef;
        }

        .team-color-astonmartin {
          color: #006f62;
        }

        .team-color-alpine {
          color: #0090ff;
        }

        .team-color-williams {
          color: #005aff;
        }

        .team-color-rb {
          color: #2b4562;
        }

        .team-color-haas {
          color: #ffffff;
          text-shadow: 0 0 1px #000;
        }

        .team-color-sauber {
          color: #52e252;
        }

        /* Position selection grid */
        .position-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.5rem;
        }

        .position-item {
          padding: 0.5rem;
          border-radius: 0.25rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .position-item:hover {
          background-color: rgba(var(--accent-rgb), 0.2);
        }

        .position-item.selected {
          background-color: rgb(var(--accent-rgb));
          color: #000;
          font-weight: bold;
        }

        /* Cyan accent elements */
        .accent-text {
          color: rgb(var(--accent-rgb));
        }

        .accent-bg {
          background-color: rgb(var(--accent-rgb));
        }

        .accent-border {
          border-color: rgb(var(--accent-rgb));
        }

        /* Disable button styles */
        .btn-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Hype button styles */
        .hype-btn {
          background-color: rgb(var(--accent-rgb));
          color: #000;
          font-weight: bold;
          padding: 0.75rem 2rem;
          border-radius: 0.375rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.2s ease;
        }

        .hype-btn:not(:disabled):hover {
          background-color: rgba(var(--accent-rgb), 0.9);
          transform: scale(1.05);
        }

        .hype-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
} 