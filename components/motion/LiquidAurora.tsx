'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * LiquidAurora Component
 * Creates animated aurora-like lights that follow cursor
 * Used on landing page only
 */
export function LiquidAurora() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track cursor movement
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden bg-black"
      style={{ pointerEvents: 'none' }}
    >
      {/* Aurora Glow Orb 1 - Follows Cursor */}
      <motion.div
        className="absolute rounded-full blur-3xl opacity-40"
        style={{
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(100, 200, 255, 0.6), transparent)',
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Aurora Glow Orb 2 - Green/Teal */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(0, 200, 150, 0.4), transparent)',
          left: '20%',
          top: '30%',
        }}
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -30, 30, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Aurora Glow Orb 3 - Purple/Magenta */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 450,
          height: 450,
          background: 'radial-gradient(circle, rgba(150, 50, 200, 0.3), transparent)',
          right: '15%',
          bottom: '20%',
        }}
        animate={{
          x: [0, -40, 40, 0],
          y: [0, 40, -40, 0],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Aurora Glow Orb 4 - Blue Accent */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 350,
          height: 350,
          background: 'radial-gradient(circle, rgba(50, 150, 255, 0.35), transparent)',
          left: '60%',
          top: '50%',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Subtle Grid Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100, 200, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 200, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
