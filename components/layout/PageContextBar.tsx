'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, Cpu, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export const PageContextBar = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <div className="flex items-center justify-between px-8 py-3 border-b border-outline-variant/10 bg-surface/50 backdrop-blur-md sticky top-0 z-40">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 overflow-hidden">
        <Lock className="w-3.5 h-3.5 text-on-surface-variant/50 shrink-0" />
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-geist text-on-surface-variant/70">
          {segments.map((segment, index) => (
            <React.Fragment key={segment}>
              <span className={cn(
                "hover:text-on-surface transition-colors cursor-default",
                index === segments.length - 1 && "text-on-surface font-medium"
              )}>
                {segment.replace(/-/g, ' ')}
              </span>
              {index < segments.length - 1 && (
                <ChevronRight className="w-3 h-3 text-outline-variant" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Enclave Status */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-surface-container-low border border-outline-variant/20 rounded-full">
           <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-secondary"></span>
           </div>
           <span className="text-[9px] font-geist uppercase tracking-tighter text-accent-secondary">
              Isolated Enclave Active
           </span>
        </div>
        
        <div className="flex items-center gap-2 text-on-surface-variant/40">
           <Cpu className="w-4 h-4" />
           <span className="text-[10px] font-ibm">0.14ms latency</span>
        </div>
      </div>
    </div>
  );
};
