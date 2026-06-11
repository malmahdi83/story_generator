"use client";

import { useMemo } from "react";

interface Star {
  id: number;
  top: string;
  left: string;
  size: string;
  duration: string;
  delay: string;
}

interface ShootingStar {
  id: number;
  top: string;
  left: string;
  duration: string;
  delay: string;
}

export default function StarsBackground() {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 120 }, (_, i) => ({
      id: i,
      top: `${(i * 37 + 11) % 100}%`,
      left: `${(i * 53 + 7) % 100}%`,
      size: `${((i * 17) % 3) + 1}px`,
      duration: `${2 + ((i * 13) % 4)}s`,
      delay: `${((i * 7) % 30) / 10}s`,
    }));
  }, []);

  const shootingStars = useMemo<ShootingStar[]>(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      top: `${5 + i * 15}%`,
      left: `${i * 20}%`,
      duration: `${5 + i * 2}s`,
      delay: `${i * 3}s`,
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #0d1b4b 0%, #050a1a 60%, #020510 100%)",
      }}
    >
      {stars.map((s) => (
        <span
          key={s.id}
          className="star"
          style={
            {
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              "--duration": s.duration,
              "--delay": s.delay,
            } as React.CSSProperties
          }
        />
      ))}

      {shootingStars.map((s) => (
        <span
          key={s.id}
          className="shooting-star"
          style={
            {
              top: s.top,
              left: s.left,
              "--shoot-duration": s.duration,
              "--shoot-delay": s.delay,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
