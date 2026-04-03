'use client';

import { PageTransition } from '@/components/motion/PageTransition';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TiltCard } from '@/components/ui/TiltCard';
import { TypewriterText } from '@/components/motion/TypewriterText';
import { getMockExitVectors } from '@/lib/mockSolRouter';
import { formatUsd } from '@/lib/utils';
import { Signpost, Target, Brain, Loader2, AlertTriangle, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useAIQuery } from '@/lib/hooks/useAIQuery';

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
  const { publicKey, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const walletAddress = publicKey?.toString() ?? null;

  const [data, setData] = useState<ReturnType<typeof getMockExitVectors> | null>(null);
  // BUG FIX: activeScenario is user-controlled only, initialised to null (no default highlight)
  const [activeScenario, setActiveScenario] = useState<number | null>(null);

  useEffect(() => { setData(getMockExitVectors()); }, []);

  // ── AI Query hook ────────────────────────────────────────────────────
  const { loading, error, data: aiData, execute, reset } = useAIQuery({
    walletAddress,
    queryType: 'exit',
  });

  const handleAnalyze = () => {
    if (!connected) { setVisible(true); return; }
    reset();
    execute();
  };

  const aiResponse: string | null = aiData?.aiResponse ?? null;

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

         {/* ── SolRouter Exit Strategy AI Panel ─────────────────────── */}
         <section>
           <div className="font-geist text-on-surface-variant text-sm border-l-2 border-accent-secondary/50 pl-3 uppercase tracking-widest mb-6 flex items-center gap-2">
             <Brain className="w-4 h-4 text-accent-secondary" />
             SolRouter Exit Intelligence
           </div>
           <TiltCard variant="default" className="relative overflow-hidden">
             <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[9px] font-ibm uppercase tracking-widest text-accent-primary/50 border border-accent-primary/20 px-2 py-1">
               <Lock className="w-2.5 h-2.5" /> Zero-Log TEE
             </div>
             <div className="p-6 space-y-5">
               <p className="font-geist text-xs text-on-surface-variant leading-relaxed max-w-2xl">
                 Connect your wallet to generate an AI-modeled exit execution plan. Your holdings are encrypted
                 before analysis. 2.0 USDC required per strategy.
               </p>

               <button
                 id="exit-analyze-btn"
                 onClick={handleAnalyze}
                 disabled={loading}
                 className="relative group flex items-center gap-2 px-6 py-3 bg-accent-secondary/10 border border-accent-secondary/40 text-accent-secondary font-geist text-xs uppercase tracking-widest hover:bg-accent-secondary/20 hover:border-accent-secondary/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                 {!connected
                   ? 'Connect Wallet to Model Exit'
                   : loading
                   ? 'Modeling Exit Vectors...'
                   : 'Generate Exit Strategy'}
               </button>

               <AnimatePresence mode="wait">
                 {loading && (
                   <motion.div key="step"
                     initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 6 }}
                     className="flex items-center gap-2 text-[10px] font-ibm uppercase tracking-widest text-accent-secondary">
                     <Loader2 className="w-3 h-3 animate-spin" /> ROUTING EXIT VECTORS TO TEE ENCLAVE...
                   </motion.div>
                 )}
               </AnimatePresence>

               <AnimatePresence>
                 {error?.includes('USDC') || error?.includes('Insufficient') ? (
                   <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                     className="flex items-start gap-3 p-4 bg-accent-tertiary/10 border border-accent-tertiary/30 text-accent-tertiary text-xs font-ibm">
                     <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                     {error} — Claim Devnet USDC at the Circle Faucet to proceed.
                   </motion.div>
                 ) : error ? (
                   <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                     className="flex items-start gap-3 p-4 bg-error/10 border border-error/30 text-error text-xs font-ibm">
                     <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{error}
                   </motion.div>
                 ) : null}
               </AnimatePresence>

               <AnimatePresence>
                 {aiResponse && (
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                     <div className="flex items-center gap-2 mb-3">
                       <ShieldCheck className="w-3.5 h-3.5 text-accent-secondary" />
                       <span className="text-[9px] font-ibm uppercase tracking-widest text-accent-secondary">
                         Verified Exit Strategy — Enclave Signed
                       </span>
                     </div>
                     <div className="p-5 bg-surface-container-lowest border border-outline-variant/20 border-l-2 border-l-accent-secondary/60">
                       <TypewriterText
                         text={aiResponse}
                         speed={18}
                         className="font-ibm text-sm text-on-surface/90 leading-relaxed whitespace-pre-wrap"
                       />
                     </div>
                     <div className="mt-3 text-[10px] font-ibm text-on-surface-variant uppercase tracking-widest">
                       Cost: <span className="text-accent-secondary">2.0 USDC</span>
                       &nbsp;·&nbsp; Guarantee Window: <span className="text-on-surface">30s</span>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
           </TiltCard>
         </section>

      </div>
    </PageTransition>
  );
}
