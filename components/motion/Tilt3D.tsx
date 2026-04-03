'use client';

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export function Tilt3D({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card center (from -1 to 1)
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const multiplier = 20; // Max rotation degrees

    // Reverse logic: rotate towards the mouse relative to center
    setRotateX((y / (rect.height / 2)) * -multiplier);
    setRotateY((x / (rect.width / 2)) * multiplier);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      {/* 
        This wrapper is crucial for the inner elements to look 3D.
        Elements inside can have transform: translateZ(...) to pop out.
      */}
      <div
        style={{ transformStyle: "preserve-3d" }}
        className="w-full h-full"
      >
        {children}
      </div>
    </motion.div>
  );
}
