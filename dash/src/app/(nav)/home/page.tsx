"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

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

interface DriverOdds {
  driver: Driver | undefined
  odds: Record<string, string>
}

export default function HomePage() {
  const [selectedDriver, setSelectedDriver] = useState("")
  const [selectedPosition, setSelectedPosition] = useState("")
  const [showOdds, setShowOdds] = useState(false)

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

  // Generate random odds for positions
  const generateOdds = (driverCode: string): Record<string, string> => {
    const positions = Array.from({ length: 20 }, (_, i) => `P${i + 1}`)
    const odds: Record<string, string> = {}

    // Base odds depending on driver's current standing
    const driverIndex = drivers.findIndex((d) => d.code === driverCode)
    const baseOdds = driverIndex < 5 ? 2.5 : driverIndex < 10 ? 5 : 10

    positions.forEach((pos, index) => {
      // Generate odds based on position and driver ranking
      const positionNumber = Number.parseInt(pos.substring(1))
      const driverRank = driverIndex + 1

      // Drivers have better odds near their current ranking
      const difference = Math.abs(positionNumber - driverRank)
      const multiplier = difference === 0 ? 1 : 1 + difference * 0.5

      // Calculate final odds with some randomness
      const randomFactor = 0.8 + Math.random() * 0.4 // 0.8 to 1.2
      const finalOdds = (baseOdds * multiplier * randomFactor).toFixed(1)

      odds[pos] = finalOdds
    })

    return odds
  }

  // Handle driver selection
  const handleDriverSelect = (driverCode: string) => {
    setSelectedDriver(driverCode)
    setSelectedPosition("")
    setShowOdds(true)
  }

  // Get driver odds
  const getDriverOdds = (): DriverOdds | null => {
    if (!selectedDriver) return null

    return {
      driver: drivers.find((d) => d.code === selectedDriver),
      odds: generateOdds(selectedDriver),
    }
  }

  const driverOdds = getDriverOdds()

  // Check if HYPE button should be enabled
  const isHypeEnabled = selectedDriver && selectedPosition

  // Handle HYPE button click
  const handleHypeClick = () => {
    if (!isHypeEnabled) return

    // Here you would handle the bet placement
    alert(`Bet placed on ${selectedDriver} to finish ${selectedPosition}!`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header with Logo and Navigation */}
      <header className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="text-4xl font-bold">
              <span className="text-white">Hype</span>
              <span className="text-cyan-400">Racing</span>
            </div>
          </div>

          {/* Navigation - Simplified to just HOME */}
          <nav className="flex justify-center">
            <Link href="/home" className="font-bold text-white border-b-2 border-cyan-400 pb-2">
              HOME
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* HYPE Betting Section */}
        <div className="mb-8 bg-gray-900 rounded-lg shadow-md p-6 border border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-1/3">
              <div className="relative">
                <select
                  className="w-full p-3 border border-gray-700 rounded-md appearance-none bg-gray-800 text-white pr-10"
                  value={selectedDriver}
                  onChange={(e) => handleDriverSelect(e.target.value)}
                >
                  <option value="">Select Driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.code} value={driver.code}>
                      {driver.name} ({driver.code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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

            <div className="w-full md:w-1/3">
              {showOdds && driverOdds && (
                <div className="text-center md:text-right">
                  <p className="font-bold text-white mb-2">Select Position</p>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(driverOdds.odds)
                      .slice(0, 20)
                      .map(([position, odd]) => (
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
                          <div className="font-bold">{odd}</div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

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
                {drivers.slice(0, 6).map((driver, index) => {
                  // Generate random odds for each position
                  const randomOdds = Array.from({ length: 7 }, () => (Math.random() * 8.5 + 1.5).toFixed(1))

                  return (
                    <tr key={index} className={index < 5 ? "border-b border-gray-800" : ""}>
                      <td className="py-3 font-bold">{driver.code}</td>
                      {randomOdds.map((odd, i) => (
                        <td key={i} className="py-3 text-center">
                          <span className="text-cyan-400">{odd}</span>
                        </td>
                      ))}
                    </tr>
                  )
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