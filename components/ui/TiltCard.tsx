'use client';

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

const TiltCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'glass' | 'ghost' }
>(({ className, variant = 'default', children, ...props }, ref) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // We destructure out the variant to avoid passing it to motion.div
  // also destructure out things that might conflict with framer-motion props
  const { initial: _initial, animate: _animate, transition: _transition, ...filteredProps } = props as any;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "relative rounded-none transition-shadow",
        "before:absolute before:inset-0 before:z-[-1] before:bg-gradient-to-br before:from-accent-primary/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
        variant === 'default' && "metis-card-default",
        variant === 'glass' && "metis-card-glass",
        variant === 'ghost' && "bg-transparent border border-outline-variant text-on-surface",
        className
      )}
      {...filteredProps}
    >
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="w-full h-full">
         {children}
      </div>
    </motion.div>
  )
})
TiltCard.displayName = "TiltCard"

export { TiltCard }
