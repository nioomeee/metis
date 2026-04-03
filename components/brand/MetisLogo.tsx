'use client';

import React from 'react';
import { Cormorant_Garamond } from 'next/font/google';
import { motion } from 'framer-motion';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

interface MetisLogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showTagline?: boolean;
  className?: string;
}

export function MetisLogo({
  size = 'md',
  animated = false,
  showTagline = false,
  className = '',
}: MetisLogoProps) {
  // Height map based on requirements
  const heightMap = {
    sm: 24,
    md: 32,
    lg: 56,
  };
  
  const height = heightMap[size];

  // If we scale the SVG height, viewBox handles the width scaling automatically.
  // 160x48 is a good standard container for "METIS" text
  const viewBox = "0 0 160 48";

  // Framer motion variants
  const etisVariants = animated
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.5 } },
      }
    : {};

  const mGradientVariants = animated
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.4, delay: 0.4 } },
      }
    : {};

  const underlineVariants = animated
    ? {
        initial: { scaleX: 0, transformOrigin: 'left' },
        animate: {
          scaleX: 1,
          transformOrigin: 'left',
          transition: { duration: 0.6, delay: 0.7, ease: 'easeOut' },
        },
      }
    : {};

  return (
    <div className={`flex flex-col items-center justify-center ${cormorant.variable} ${className}`}>
      {/* SVG Container has a subtle drop-shadow filter applied via inline style for maximum compatibility */}
      <motion.svg
        width="auto"
        height={height}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 0 20px rgba(123,110,246,0.25))" }}
        className="overflow-visible"
        {...({} as any)} // Satisfy motion.svg typing if needed
      >
        <defs>
          <linearGradient
            id="metis-m-gradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="#7B6EF6" />
            <stop offset="100%" stopColor="#4CC9F0" />
          </linearGradient>

          <linearGradient
            id="metis-underline-gradient"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor="#7B6EF6" />
            <stop offset="70%" stopColor="#4CC9F0" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Text Group */}
        <text
          x="80"
          y="36" // Baseline
          textAnchor="middle"
          fontFamily="var(--font-cormorant)"
          fontWeight="600"
          fontSize="36px"
          letterSpacing="-1.5px"
        >
          {animated ? (
            <motion.tspan
              fill="url(#metis-m-gradient)"
              initial="initial"
              animate="animate"
              variants={mGradientVariants as any}
            >
              M
            </motion.tspan>
          ) : (
            <tspan fill="url(#metis-m-gradient)">M</tspan>
          )}

          {animated ? (
            <motion.tspan
              fill="#E8EAF2"
              initial="initial"
              animate="animate"
              variants={etisVariants as any}
            >
              ETIS
            </motion.tspan>
          ) : (
            <tspan fill="#E8EAF2">ETIS</tspan>
          )}
        </text>

        {/* Underline Rect */}
        {animated ? (
          <motion.rect
            x="36" // Start roughly 22% from left (160 * 0.22 = ~35)
            y="42" // Baseline + 6
            width="88" // 55% of 160
            height="1"
            fill="url(#metis-underline-gradient)"
            opacity="0.7"
            initial="initial"
            animate="animate"
            variants={underlineVariants as any}
          />
        ) : (
          <rect
            x="36"
            y="42"
            width="88"
            height="1"
            fill="url(#metis-underline-gradient)"
            opacity="0.7"
          />
        )}
      </motion.svg>

      {/* Optional Tagline */}
      {showTagline && (
        <motion.p
          className="mt-1.5 text-center text-[10px] text-on-surface-variant tracking-[0.3em] font-medium"
          style={{ fontFamily: 'var(--font-dm)', fontSize: '9px' }}
          initial={animated ? { opacity: 0, y: 5 } : false}
          animate={animated ? { opacity: 1, y: 0 } : false}
          transition={animated ? { duration: 0.6, delay: 1 } : {}}
        >
          INTELLIGENCE INFRASTRUCTURE
        </motion.p>
      )}
    </div>
  );
}
