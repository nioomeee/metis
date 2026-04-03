'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-accent-secondary" />,
    error: <AlertCircle className="w-5 h-5 text-error" />,
    info: <Info className="w-5 h-5 text-accent-primary" />,
    warning: <AlertCircle className="w-5 h-5 text-accent-tertiary" />,
  };

  const colors = {
    success: 'border-accent-secondary/30 bg-surface-container-low/95 shadow-[0_0_15px_rgba(76,201,240,0.1)]',
    error: 'border-error/30 bg-surface-container-low/95 shadow-[0_0_15px_rgba(240,76,76,0.1)]',
    info: 'border-accent-primary/30 bg-surface-container-low/95 shadow-[0_0_15px_rgba(123,110,246,0.1)]',
    warning: 'border-accent-tertiary/30 bg-surface-container-low/95 shadow-[0_0_15px_rgba(255,188,66,0.1)]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: 10, transition: { duration: 0.2 } }}
      className={cn(
        'pointer-events-auto flex items-center gap-3 p-4 border rounded-sm min-w-[280px] backdrop-blur-md',
        colors[type]
      )}
    >
      <div className="shrink-0">{icons[type]}</div>
      <div className="flex-1 font-dm text-sm text-on-surface">{message}</div>
      <button 
        onClick={onClose}
        className="shrink-0 text-on-surface-variant hover:text-on-surface transition-colors p-1"
      >
        <X className="w-4 h-4" />
      </button>
      
      {/* Dynamic Progress Indicator */}
      <motion.div 
        initial={{ width: '100%' }}
        animate={{ width: 0 }}
        transition={{ duration: 4, ease: 'linear' }}
        className={cn(
          'absolute bottom-0 left-0 h-0.5 opacity-50',
          {
            'bg-accent-secondary': type === 'success',
            'bg-error': type === 'error',
            'bg-accent-primary': type === 'info',
            'bg-accent-tertiary': type === 'warning',
          }
        )}
      />
    </motion.div>
  );
};
