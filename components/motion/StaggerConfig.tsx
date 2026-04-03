'use client';

import { motion } from 'framer-motion';

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 15, filter: 'blur(4px)' },
  show: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export function StaggerRow({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
      <motion.tr variants={staggerItem as any} className={className}>
         {children}
      </motion.tr>
    )
}
