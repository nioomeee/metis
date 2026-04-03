'use client';

import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';

export function LiquidAurora() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Cursor parallax: noticeable and fluid
  const sx = useSpring(mouseX, { damping: 50, stiffness: 20, mass: 2 });
  const sy = useSpring(mouseY, { damping: 50, stiffness: 20, mass: 2 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Range: -40 to +40 px for subtle parallax
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 80);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 80);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        background: '#07080C',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* ── Blob 1: Electric Violet — top-left, cursor-driven ── */}
      <motion.div
        style={{
          x: sx,
          y: sy,
          position: 'absolute',
          top: '-20%',
          left: '-15%',
          width: '70vw',
          height: '70vh',
          borderRadius: '62% 38% 46% 54% / 60% 44% 56% 40%',
          background: 'radial-gradient(ellipse at center, rgba(123,110,246,0.6) 0%, rgba(123,110,246,0.1) 60%, transparent 100%)',
          filter: 'blur(90px)',
        }}
        animate={{
          x: ['-15%', '15%', '-5%'],
          y: ['-10%', '15%', '-10%'],
          borderRadius: [
            '62% 38% 46% 54% / 60% 44% 56% 40%',
            '38% 62% 63% 37% / 41% 57% 43% 59%',
            '62% 38% 46% 54% / 60% 44% 56% 40%',
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Blob 2: Hot Pink — center ── */}
      <motion.div
        style={{
          position: 'absolute',
          top: '15%',
          left: '20%',
          width: '65vw',
          height: '60vh',
          borderRadius: '40% 60% 55% 45% / 50% 40% 60% 50%',
          background: 'radial-gradient(ellipse at center, rgba(247,37,133,0.50) 0%, rgba(247,37,133,0.05) 65%, transparent 100%)',
          filter: 'blur(100px)',
        }}
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.15, 0.9, 1],
          borderRadius: [
            '40% 60% 55% 45% / 50% 40% 60% 50%',
            '60% 40% 45% 55% / 40% 60% 40% 60%',
            '40% 60% 55% 45% / 50% 40% 60% 50%',
          ],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Blob 3: Ice Blue — bottom-right ── */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '75vw',
          height: '75vh',
          borderRadius: '70% 30% 50% 50% / 30% 70% 30% 70%',
          background: 'radial-gradient(ellipse at center, rgba(76,201,240,0.45) 0%, rgba(76,201,240,0.05) 65%, transparent 100%)',
          filter: 'blur(110px)',
        }}
        animate={{
          x: [0, -80, 50, 0],
          y: [0, 50, -40, 0],
          scale: [1, 0.85, 1.1, 1],
          borderRadius: [
            '70% 30% 50% 50% / 30% 70% 30% 70%',
            '30% 70% 50% 50% / 70% 30% 70% 30%',
            '70% 30% 50% 50% / 30% 70% 30% 70%',
          ],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Blob 4: Deep Magenta — bottom-left accent ── */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '0%',
          left: '-5%',
          width: '50vw',
          height: '50vh',
          borderRadius: '55% 45% 40% 60% / 50% 55% 45% 50%',
          background: 'radial-gradient(ellipse at center, rgba(219,39,119,0.40) 0%, transparent 75%)',
          filter: 'blur(85px)',
        }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.25, 0.85, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Blob 5: Soft Lavender — top-right ── */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '0%',
          width: '45vw',
          height: '45vh',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(167,139,250,0.35) 0%, transparent 70%)',
          filter: 'blur(75px)',
        }}
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 40, -30, 0],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Film grain overlay ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
          mixBlendMode: 'overlay' as const,
        }}
      />
    </div>
  );
}
