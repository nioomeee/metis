'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { X, Shield, Cpu, Zap, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    title: "Secure Enclave Inference",
    description: "Your portfolio data is processed inside hardware-isolated Intel SGX enclaves. Even METIS administrators cannot see your raw data.",
    icon: <Shield className="w-8 h-8 text-accent-primary" />,
    color: "accent-primary"
  },
  {
    title: "Zero-Log Intelligence",
    description: "Every inference session is ephemeral. Logs are purged at the hardware level immediately after delivery to your browser.",
    icon: <Cpu className="w-8 h-8 text-accent-secondary" />,
    color: "accent-secondary"
  },
  {
    title: "Submerged Execution",
    description: "Multi-hop routing ensures your RPC calls are obfuscated from public mempools, preventing frontrunning on your trades.",
    icon: <Zap className="w-8 h-8 text-accent-tertiary" />,
    color: "accent-tertiary"
  }
];

export const OnboardingTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('metis_tour_completed');
    if (!hasSeenTour) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('metis_tour_completed', 'true');
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[100]"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface-container border border-outline-variant/30 rounded-none w-full max-w-lg overflow-hidden pointer-events-auto shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-outline-variant/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                   <span className="text-[10px] font-geist uppercase tracking-widest text-on-surface-variant">System Initialization</span>
                </div>
                <button onClick={handleClose} className="p-1 text-on-surface-variant hover:text-on-surface transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-10 text-center">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex justify-center flex-col items-center">
                    <div className="p-4 bg-surface-container-highest rounded-full mb-6 border border-outline-variant/20 shadow-inner">
                      {STEPS[currentStep].icon}
                    </div>
                    <h2 className="text-3xl font-serif italic text-on-surface mb-4">
                      {STEPS[currentStep].title}
                    </h2>
                    <p className="text-on-surface-variant font- dm leading-relaxed text-sm max-w-sm mx-auto">
                      {STEPS[currentStep].description}
                    </p>
                  </div>
                </motion.div>

                {/* Progress Indicators */}
                <div className="flex justify-center gap-2 mt-12 mb-8">
                  {STEPS.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "h-1 transition-all duration-300",
                        i === currentStep ? "w-8 bg-accent-primary" : "w-2 bg-outline-variant/30"
                      )} 
                    />
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-none py-6 border-outline-variant/30"
                    onClick={handleClose}
                  >
                    SKIP PROTOCOL
                  </Button>
                  <Button 
                    className="flex-1 rounded-none py-6 metis-btn-primary"
                    onClick={nextStep}
                  >
                    {currentStep === STEPS.length - 1 ? (
                      <span className="flex items-center gap-2">INITIALIZE <Check className="w-4 h-4" /></span>
                    ) : (
                      <span className="flex items-center gap-2">CONTINUE <ChevronRight className="w-4 h-4" /></span>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Footer Scanline Decor */}
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent relative overflow-hidden">
                <motion.div 
                  animate={{ x: ['-100%', '100%'] }} 
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-accent-primary/40 w-20 blur-md"
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
