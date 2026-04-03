'use client';

import { PageTransition } from '@/components/motion/PageTransition';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getMockExitVectors } from '@/lib/mockSolRouter';
import { formatUsd } from '@/lib/utils';
import { Signpost, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function RiskMatrix() {
  return (
    <div className="absolute top-10 right-10 opacity-10 pointer-events-none hidden lg:grid grid-cols-4 grid-rows-4 gap-1 w-64 h-64 z-0 mix-blend-screen">
       {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="bg-surface-container-highest border border-outline-variant/30 rounded-sm" />
       ))}
       <div className="absolute inset-0 bg-gradient-to-tr from-accent-primary/20 via-transparent to-error/20" />
    </div>
  );
}

export default function ExitVectorPage() {
  const [data, setData] = useState<ReturnType<typeof getMockExitVectors> | null>(null);
  // BUG FIX: activeScenario is user-controlled only, initialised to null (no default highlight)
  const [activeScenario, setActiveScenario] = useState<number | null>(null);

  useEffect(() => {
    setData(getMockExitVectors());
  }, []);

  if (!data) return null;

  return (
    <PageTransition>
      <div className="space-y-8 relative">
         <RiskMatrix />
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-serif italic text-4xl text-on-surface mb-2">Exit Vector Modeling</h2>
              <p className="font-geist text-on-surface-variant text-sm border-l-2 border-accent-secondary/50 pl-3 uppercase tracking-widest">
                Simulated Liquidity Routes &amp; Slippage Optimization
              </p>
            </div>
         </div>

         {data.positions.map((pos) => (
            <Card key={pos.asset} variant="glass" className="border-outline-variant/30 bg-surface-container-lowest/80">
               <CardHeader className="border-b border-outline-variant/15 flex flex-row items-center justify-between pb-4">
                  <div className="flex items-center gap-3">
                     <Signpost className="w-5 h-5 text-accent-primary" />
                     <CardTitle className="font-geist uppercase tracking-widest text-sm text-accent-primary">
                        Vector Analysis: {pos.asset}
                     </CardTitle>
                  </div>
                  <div className="flex items-center gap-6 font-ibm text-sm text-on-surface-variant">
                     <div>Current Price: <span className="text-on-surface">${pos.currentPrice}</span></div>
                     <div>Total Holding: <span className="text-on-surface">{pos.holding} {pos.asset}</span></div>
                  </div>
               </CardHeader>
               <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                     {pos.vectors.map((vec, i) => {
                           let initialVal: { opacity: number; x?: number; y?: number } = { opacity: 0, y: 50 };
                           if (i === 0) initialVal = { opacity: 0, x: -50, y: 0 };
                           else if (i === pos.vectors.length - 1) initialVal = { opacity: 0, x: 50, y: 0 };

                           // BUG FIX: "RECOMMENDED" is a cosmetic label only — it does NOT set activeScenario.
                           // Visual highlight is entirely user-controlled via onClick.
                           const isRecommended = i === 1; // visual badge only
                           const isActive = activeScenario === i;

                           return (
                           <motion.div
                              key={i}
                              initial={initialVal}
                              animate={{ opacity: 1, x: 0, y: 0 }}
                              transition={{ duration: 0.6, delay: i * 0.15, ease: 'easeOut' }}
                              onClick={() => setActiveScenario(i)}
                              style={{
                                position: 'relative',
                                padding: 20,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                minHeight: 180,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                // Highlight is ONLY active when user has selected this card
                                border: isActive
                                  ? '1px solid var(--accent-primary, #7B6EF6)'
                                  : '1px solid var(--outline-variant, rgba(70,72,80,0.3))',
                                background: isActive
                                  ? 'rgba(123,110,246,0.07)'
                                  : 'var(--surface, #07080C)',
                                transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
                                boxShadow: isActive
                                  ? '0 0 20px rgba(123,110,246,0.15)'
                                  : 'none',
                              }}
                           >
                              {/* Shimmer only on active card */}
                              {isActive && (
                                 <div
                                   className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,var(--accent-primary)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_3s_linear_infinite]"
                                   style={{ animationName: 'shimmer' }}
                                 />
                              )}
                              <style>{`
                                @keyframes shimmer {
                                  0% { background-position: 200% 0; }
                                  100% { background-position: -200% 0; }
                                }
                              `}</style>

                              <div className="relative z-10">
                                 <div className="font-geist text-xs text-on-surface uppercase tracking-widest mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                       {vec.label}
                                       {/* RECOMMENDED is purely cosmetic — does NOT control active state */}
                                       {isRecommended && (
                                         <span className="text-[9px] bg-accent-primary/20 text-accent-primary px-1.5 py-0.5 rounded-sm">
                                           REC
                                         </span>
                                       )}
                                    </div>
                                    {vec.impact === 'MINIMAL' || vec.impact === 'LOW' ? (
                                       <div className="w-2 h-2 rounded-full bg-accent-secondary shadow-[0_0_8px_rgba(76,201,240,0.6)]" />
                                    ) : vec.impact === 'CRITICAL' || vec.impact === 'HIGH' ? (
                                       <div className="w-2 h-2 rounded-full bg-error" />
                                    ) : (
                                       <div className="w-2 h-2 rounded-full bg-accent-tertiary" />
                                    )}
                                 </div>
                                 <div className="space-y-2 font-ibm text-xs">
                                    <div className="flex justify-between text-on-surface-variant">
                                       <span>Size</span>
                                       <span className="text-on-surface font-medium">{vec.size}</span>
                                    </div>
                                    <div className="flex justify-between text-on-surface-variant">
                                       <span>Expected Slippage</span>
                                       <span className={`${vec.expectedSlippage > 1 ? 'text-error' : 'text-accent-primary'}`}>
                                          {vec.expectedSlippage}%
                                       </span>
                                    </div>
                                    <div className="flex justify-between text-on-surface-variant">
                                       <span>Algorithm ETA</span>
                                       <span className="text-on-surface">{vec.timeToExecute}</span>
                                    </div>
                                 </div>
                              </div>

                              <div className="mt-6 pt-4 border-t border-outline-variant/15 flex items-center justify-between relative z-10">
                                 <div className="font-serif text-xl text-on-surface">{formatUsd(vec.netProceeds)}</div>
                                 <Button
                                   variant={isActive ? 'default' : 'ghost'}
                                   size="sm"
                                   className="h-8 px-3 text-xs tracking-widest"
                                 >
                                    <Target className="w-4 h-4 mr-2" /> EXECUTE
                                 </Button>
                              </div>
                           </motion.div>
                         );
                       })}
                  </div>
               </CardContent>
            </Card>
         ))}

         <div className="text-center font-geist text-xs text-on-surface-variant uppercase tracking-widest mt-8">
            Routes calculated using local order-book aggregation via remote TEE enclave. <br/>
            Execution guarantees hold for 30 seconds.
         </div>
      </div>
    </PageTransition>
  );
}
