'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function DynamicBackground() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const onChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  // Duration changes based on reduced motion (much slower if reduced)
  const baseDuration = prefersReducedMotion ? 120 : 12;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        background: '#07080C', // Match global background to avoid jarring contrasts
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Background base mesh to give some texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(45,62,80,0.15) 0%, transparent 80%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Blob 1: Deep Blue */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '60vw',
          height: '60vh',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(26,58,82,0.35) 0%, transparent 70%)',
          filter: 'blur(90px)',
          mixBlendMode: 'screen',
          willChange: 'transform',
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, 40, -50, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: baseDuration, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Blob 2: Purple */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '70vw',
          height: '70vh',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(74,26,111,0.3) 0%, transparent 65%)',
          filter: 'blur(100px)',
          mixBlendMode: 'screen',
          willChange: 'transform',
        }}
        animate={{
          x: [0, -60, 40, 0],
          y: [0, -40, 60, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{ duration: baseDuration * 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Blob 3: Teal */}
      <motion.div
        style={{
          position: 'absolute',
          top: '30%',
          right: '25%',
          width: '45vw',
          height: '45vh',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(15,90,111,0.25) 0%, transparent 60%)',
          filter: 'blur(80px)',
          mixBlendMode: 'screen',
          willChange: 'transform',
        }}
        animate={{
          x: [0, -30, 30, 0],
          y: [0, 50, -40, 0],
          scale: [1, 1.05, 0.9, 1],
        }}
        transition={{ duration: baseDuration * 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Blob 4: Cool Gray */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '15%',
          width: '50vw',
          height: '50vh',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(45,62,80,0.4) 0%, transparent 70%)',
          filter: 'blur(85px)',
          mixBlendMode: 'screen',
          willChange: 'transform',
        }}
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: baseDuration * 1.3, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Film grain overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.02,
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}
