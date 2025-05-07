"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight, BarChart3, TrendingUp, Trophy, Shield, Clock, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import RacingBackground from "@/components/RacingBackground"

export default function LandingPage() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const racingLinesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY
      setScrollPosition(position)

      if (racingLinesRef.current) {
        // Animate racing lines based on scroll
        const elements = racingLinesRef.current.querySelectorAll(".racing-line")
        elements.forEach((el, index) => {
          const htmlEl = el as HTMLElement
          const speed = index % 2 === 0 ? 0.2 : 0.1
          const offset = position * speed
          htmlEl.style.transform = `translateX(${index % 2 === 0 ? -offset : offset}px)`
        })
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <RacingBackground />
      <div ref={racingLinesRef} className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Racing lines that move on scroll */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`racing-line absolute h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-${i % 3 === 0 ? "20" : "10"}`}
            style={{
              top: `${(i + 1) * 12}%`,
              left: 0,
              right: 0,
              height: `${i % 3 === 0 ? 2 : 1}px`,
              filter: `blur(${i % 2 === 0 ? 1 : 0}px)`,
            }}
          />
        ))}

        {/* Racing checkered pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #000 25%, transparent 25%),
              linear-gradient(-45deg, #000 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #000 75%),
              linear-gradient(-45deg, transparent 75%, #000 75%)
            `,
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            transform: `translateY(${scrollPosition * 0.1}px)`,
          }}
        />

        {/* Racing blur effect */}
        <div
          className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-cyan-500/5 to-transparent"
          style={{
            transform: `translateY(${Math.min(scrollPosition * 0.2, 100)}px)`,
          }}
        />

        {/* Speed lines that appear on scroll */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`speed-${i}`}
            className="absolute bg-cyan-400/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 150 + 50}px`,
              height: "1px",
              opacity: Math.min(scrollPosition * 0.001, 0.3),
              transform: `rotate(${Math.random() * 180}deg)`,
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/images/hr-logo.png" alt="HypeRacing Logo" width={40} height={40} className="h-8 w-auto" />
            <span className="text-xl font-bold">HypeRacing</span>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="#features" className="text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors">
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors"
            >
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-zinc-700 text-white hover:bg-zinc-800 hover:text-cyan-400"
              asChild
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium" asChild>
              <Link href="/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-black text-white relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"></div>
            <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-30"></div>
            <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-30"></div>
          </div>
          <div
            className="absolute inset-0 z-0 opacity-20"
            style={{
              background: `radial-gradient(circle at ${50 + Math.sin(scrollPosition * 0.002) * 10}% ${50 + Math.cos(scrollPosition * 0.002) * 10}%, rgba(6, 182, 212, 0.3), transparent 70%)`,
            }}
          />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Bet Smarter with <span className="text-cyan-400">Data-Driven</span> Insights
                  </h1>
                  <p className="max-w-[600px] text-zinc-400 md:text-xl">
                    HypeRacing gives you the edge with real-time analytics, predictive models, and expert insights for
                    sports betting.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium" size="lg" asChild>
                    <Link href="/signup">
                      Get Started <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-zinc-700 text-white hover:bg-zinc-800 hover:text-cyan-400"
                    asChild
                  >
                    <Link href="#demo">Watch Demo</Link>
                  </Button>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="inline-block h-8 w-8 rounded-full bg-zinc-800 ring-2 ring-black" />
                    ))}
                  </div>
                  <div className="text-zinc-400">
                    <span className="font-medium">4,000+</span> bettors trust HypeRacing
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[300px] sm:h-[400px] sm:w-[350px] lg:h-[500px] lg:w-[400px] xl:h-[600px] xl:w-[500px] rounded-xl overflow-hidden border-2 border-zinc-800 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Image
                    src="/f1-dash-image.jpeg"
                    alt="HypeRacing App Screenshot"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-zinc-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-cyan-950/50 px-3 py-1 text-sm text-cyan-400 border border-cyan-900/50">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Data-Driven Advantage</h2>
                <p className="max-w-[900px] text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  HypeRacing combines cutting-edge analytics with expert insights to give you the edge in sports
                  betting.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-950/50 border border-cyan-900/50">
                  <BarChart3 className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Real-Time Analytics</h3>
                  <p className="text-zinc-400">Get live updates, odds movements, and betting trends as they happen.</p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-950/50 border border-cyan-900/50">
                  <TrendingUp className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Predictive Models</h3>
                  <p className="text-zinc-400">
                    AI-powered predictions based on historical data and current conditions.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-950/50 border border-cyan-900/50">
                  <Trophy className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Expert Insights</h3>
                  <p className="text-zinc-400">Access analysis from industry experts and professional bettors.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-black relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-20"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-20"></div>
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-cyan-950/50 px-3 py-1 text-sm text-cyan-400 border border-cyan-900/50">
                    Why Choose HypeRacing
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    The Smart Bettor's Choice
                  </h2>
                  <p className="max-w-[600px] text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    HypeRacing isn't just another betting app. It's a comprehensive platform designed by bettors, for
                    bettors.
                  </p>
                </div>
                <ul className="grid gap-4">
                  <li className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-cyan-400" />
                    <span>Secure and regulated platform</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-cyan-400" />
                    <span>Instant deposits and fast withdrawals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-cyan-400" />
                    <span>Comprehensive statistics and analysis</span>
                  </li>
                </ul>
                <div>
                  <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium" asChild>
                    <Link href="/signup">
                      Join HypeRacing <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[400px] w-full overflow-hidden rounded-xl border-2 border-zinc-800 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="HypeRacing Dashboard"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-zinc-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-cyan-950/50 px-3 py-1 text-sm text-cyan-400 border border-cyan-900/50">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
                <p className="max-w-[900px] text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Don't just take our word for it. Here's what HypeRacing users have to say.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              {[
                {
                  quote:
                    "HypeRacing's data analysis has completely transformed my betting strategy. I'm making more informed decisions and seeing better results.",
                  author: "Michael T.",
                  role: "Professional Bettor",
                },
                {
                  quote:
                    "As a casual bettor, HypeRacing makes it easy to understand complex data and make smarter bets without spending hours on research.",
                  author: "James L.",
                  role: "Weekend Bettor",
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-6 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                >
                  <div className="space-y-4">
                    <p className="text-zinc-400">"{testimonial.quote}"</p>
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-zinc-800"></div>
                      <div>
                        <p className="font-medium">{testimonial.author}</p>
                        <p className="text-sm text-zinc-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-cyan-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900 to-cyan-800"></div>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25px 25px, rgba(6, 182, 212, 0.2) 2px, transparent 0), radial-gradient(circle at 75px 75px, rgba(6, 182, 212, 0.2) 2px, transparent 0)",
              backgroundSize: "100px 100px",
            }}
          ></div>
          <div className="container grid items-center gap-6 px-4 text-center md:px-6 lg:gap-10 relative z-10">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Bet Smarter?</h2>
              <p className="mx-auto max-w-[700px] text-cyan-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of smart bettors who are using data to gain an edge.
              </p>
            </div>
            <div className="mx-auto flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Button size="lg" className="bg-black text-cyan-400 hover:bg-zinc-900 border border-cyan-700" asChild>
                <Link href="/signup">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-cyan-800" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t border-zinc-800 bg-black">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex items-center gap-2">
            <Image src="/images/hr-logo.png" alt="HypeRacing Logo" width={32} height={32} className="h-6 w-auto" />
            <span className="text-xl font-bold">HypeRacing</span>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors">
              Contact
            </Link>
          </nav>
          <div className="text-sm text-zinc-500">© {new Date().getFullYear()} HypeRacing. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
} 