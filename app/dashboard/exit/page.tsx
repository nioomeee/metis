'use client';

import { PageTransition } from '@/components/motion/PageTransition';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getMockExitVectors } from '@/lib/mockSolRouter';
import { formatUsd } from '@/lib/utils';
import { Signpost, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
                Simulated Liquidity Routes & Slippage Optimization
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
                           // Define custom entrance directions based on vector properties
                           let initialVal: any = { opacity: 0, y: 50 };
                           if (i === 0) initialVal = { opacity: 0, x: -50, y: 0 }; // Conservative
                           else if (i === pos.vectors.length - 1) initialVal = { opacity: 0, x: 50, y: 0 }; // Aggressive
                           
                           const isRecommended = i === 1; // 25% exit is recommended

                           return (
                           <motion.div 
                              key={i} 
                              initial={initialVal}
                              animate={{ opacity: 1, x: 0, y: 0 }}
                              transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                              className={`relative bg-surface p-5 border border-outline-variant/20 hover:border-accent-primary/50 transition-all flex flex-col justify-between min-h-[180px] overflow-hidden ${isRecommended ? 'shadow-[0_0_20px_rgba(123,110,246,0.15)] scale-105 z-10' : ''}`}
                           >
                              {isRecommended && (
                                 <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,var(--accent-primary)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_3s_linear_infinite]" 
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
                                       {isRecommended && <span className="text-[9px] bg-accent-primary/20 text-accent-primary px-1.5 py-0.5 rounded-sm">REC</span>}
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
                                 <Button variant={isRecommended ? "default" : "ghost"} size="sm" className="h-8 px-3 text-xs tracking-widest">
                                    <Target className="w-4 h-4 mr-2" /> EXECUTE
                                 </Button>
                              </div>
                           </motion.div>
                        )
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
