'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Command, Move, Terminal, MousePointer2 } from 'lucide-react';

const SHORTCUTS = [
  { key: 'G + P', label: 'Go to Portfolio', icon: <div className="w-4 h-4 bg-accent-primary/20 text-accent-primary flex items-center justify-center text-[10px] font-bold">P</div> },
  { key: 'G + I', label: 'Go to Intelligence', icon: <div className="w-4 h-4 bg-accent-secondary/20 text-accent-secondary flex items-center justify-center text-[10px] font-bold">I</div> },
  { key: 'G + V', label: 'Go to Vault', icon: <div className="w-4 h-4 bg-accent-tertiary/20 text-accent-tertiary flex items-center justify-center text-[10px] font-bold">V</div> },
  { key: 'G + T', label: 'Go to Tax', icon: <div className="w-4 h-4 bg-error/20 text-error flex items-center justify-center text-[10px] font-bold">T</div> },
  { key: 'G + S', label: 'Go to Settings', icon: <div className="w-4 h-4 bg-on-surface-variant/20 text-on-surface-variant flex items-center justify-center text-[10px] font-bold">S</div> },
  { key: '/', label: 'Global Search', icon: <MousePointer2 className="w-3 h-3" /> },
  { key: '?', label: 'Toggle Shortcuts', icon: <Move className="w-3 h-3" /> },
  { key: 'CMD + K', label: 'Command Palette', icon: <Command className="w-3 h-3" /> },
];

export const KeyboardShortcutsModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-md z-[110]"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-0 flex items-center justify-center z-[111] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-surface-container-low border border-outline-variant/30 rounded-none w-full max-w-md overflow-hidden pointer-events-auto shadow-2xl"
            >
              {/* Header */}
              <div className="p-4 border-b border-outline-variant/15 flex items-center justify-between bg-surface-container-highest/30">
                <div className="flex items-center gap-2">
                   <Terminal className="w-4 h-4 text-accent-primary" />
                   <span className="text-[10px] font-geist uppercase tracking-widest text-on-surface">METIS Command Set</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 text-on-surface-variant hover:text-on-surface transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid */}
              <div className="p-6 grid grid-cols-1 gap-2">
                {SHORTCUTS.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-surface-container-high transition-colors group">
                    <div className="flex items-center gap-3">
                       <div className="w-6 h-6 rounded-sm bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center group-hover:border-accent-primary/40 transition-colors">
                         {s.icon}
                       </div>
                       <span className="text-sm font-dm text-on-surface-variant group-hover:text-on-surface transition-colors">{s.label}</span>
                    </div>
                    <div className="flex gap-1">
                      {s.key.split(' + ').map((k, j) => (
                        <div key={j} className="px-1.5 py-0.5 min-w-[20px] text-center bg-surface-container-highest border border-outline-variant/40 rounded-sm text-[10px] font-geist text-on-surface font-semibold shadow-sm">
                          {k}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 bg-surface-container-highest/20 border-t border-outline-variant/10 text-center">
                 <p className="text-[10px] font-geist text-on-surface-variant uppercase tracking-tighter">
                   System v2.4.9 — Hotkey Registry Active
                 </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
