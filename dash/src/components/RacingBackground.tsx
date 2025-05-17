'use client';

import { useEffect, useRef, useState } from 'react';

// Define the type for speed lines
type SpeedLine = {
  top: number;
  left: number;
  width: number;
  transform: string;
};

export default function RacingBackground() {
  const racingLinesRef = useRef<HTMLDivElement>(null);
  const [speedLines, setSpeedLines] = useState<SpeedLine[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set mounted state to true
    setIsMounted(true);
    
    // Generate consistent speed lines on client only
    const lines = Array.from({ length: 15 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      width: Math.random() * 150 + 50,
      transform: `rotate(${Math.random() * 180}deg)`,
    }));
    setSpeedLines(lines);

    const handleScroll = () => {
      const position = window.scrollY;

      if (racingLinesRef.current) {
        // Animate racing lines based on scroll
        const elements = racingLinesRef.current.querySelectorAll(".racing-line");
        elements.forEach((el, index) => {
          const htmlEl = el as HTMLElement;
          const speed = index % 2 === 0 ? 0.2 : 0.1;
          const offset = position * speed;
          htmlEl.style.transform = `translateX(${index % 2 === 0 ? -offset : offset}px)`;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
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
        }}
      />

      {/* Racing blur effect */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-cyan-500/5 to-transparent" />

      {/* Speed lines - Only rendered after client-side generation */}
      {isMounted && speedLines.map((line, i) => (
        <div
          key={`speed-${i}`}
          className="absolute bg-cyan-400/20"
          style={{
            top: `${line.top}%`,
            left: `${line.left}%`,
            width: `${line.width}px`,
            height: "1px",
            opacity: 0.3,
            transform: line.transform,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
} 