'use client';

import { PageTransition } from '@/components/motion/PageTransition';
import { NumberScramble } from '@/components/motion/NumberScramble';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { TiltCard } from '@/components/ui/TiltCard';
import { StaggerRow, staggerContainer } from '@/components/motion/StaggerConfig';
import { motion } from 'framer-motion';
import { getMockPortfolio } from '@/lib/mockSolRouter';
import { formatUsd, formatSol } from '@/lib/utils';
import { Activity, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

function HealthScoreWidget({ score }: { score: number }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-14 h-14 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
           <circle cx="28" cy="28" r={radius} className="stroke-surface-container-highest" strokeWidth="4" fill="transparent" />
           <motion.circle 
             cx="28" cy="28" r={radius} 
             className="stroke-accent-primary" 
             strokeWidth="4" 
             fill="transparent" 
             strokeDasharray={circumference}
             initial={{ strokeDashoffset: circumference }}
             animate={{ strokeDashoffset: offset }}
             transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
             strokeLinecap="round"
           />
        </svg>
        <span className="absolute font-dm font-bold text-sm text-on-surface">{score}</span>
      </div>
      <div>
         <div className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Portfolio Health</div>
         <div className="text-xs text-accent-primary flex items-center gap-1">System Optimal</div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const [data, setData] = useState<ReturnType<typeof getMockPortfolio> | null>(null);

  useEffect(() => {
    // Fake load delay
    const t = setTimeout(() => {
      setData(getMockPortfolio());
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const totalVal = useAnimatedNumber(data?.totalValueUsd ?? 0, 1500, 2);

  if (!data) return null; // In real app, skeleton loader here

  return (
    <PageTransition>
      <div className="space-y-10">
        
        {/* Top Hero Stats */}
        <section className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-outline-variant/15 pb-8">
          <div>
            <div className="font-geist text-accent-secondary text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" /> Live Exposure
            </div>
            <div className="font-serif text-5xl md:text-7xl text-on-surface tracking-tighter flex items-center gap-4">
               $ <NumberScramble value={totalVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
            </div>
          </div>
          
          <div className="flex gap-10 text-right font-geist">
             <div>
               <div className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">24H Delta</div>
               <div className={`text-lg flex items-center justify-end gap-1 ${data.pnl24h >= 0 ? 'text-accent-secondary' : 'text-error'}`}>
                  {data.pnl24h >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {formatUsd(Math.abs(data.pnl24h))} ({data.pnlPercent}%)
               </div>
             </div>
             <div>
               <div className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Raw SOL</div>
               <div className="text-lg text-on-surface flex items-center gap-2 justify-end">
                  <Wallet className="w-4 h-4 text-outline-variant" /> {formatSol(data.solBalance * 1e9)}
               </div>
             </div>
             <div className="hidden lg:block border-l border-outline-variant/15 pl-8">
               <HealthScoreWidget score={data.riskScore} />
             </div>
          </div>
        </section>

        {/* Asset Table / Topology */}
        <section>
          <div className="font-geist text-on-surface-variant text-sm border-l-2 border-accent-primary/50 pl-3 uppercase tracking-widest mb-6">
            Asset Topology & Allocation
          </div>
          
          <TiltCard variant="default" className="border-t border-outline-variant/30">
            <div className="p-0">
               <div className="overflow-x-auto">
                 <table className="w-full text-left font-ibm border-collapse">
                    <thead>
                       <tr className="border-b border-outline-variant/15 text-[10px] text-on-surface-variant uppercase tracking-widest bg-surface-container-lowest/50">
                          <th className="py-4 px-6 font-medium">Asset</th>
                          <th className="py-4 px-6 font-medium text-right">Balance</th>
                          <th className="py-4 px-6 font-medium text-right">Value (USD)</th>
                          <th className="py-4 px-6 font-medium text-right">24H</th>
                          <th className="py-4 px-6 font-medium text-right">Weight</th>
                       </tr>
                    </thead>
                    <motion.tbody 
                      variants={staggerContainer} 
                      initial="hidden" 
                      animate="show" 
                      className="divide-y divide-outline-variant/10"
                    >
                       {data.assets.map((asset) => (
                          <StaggerRow key={asset.symbol} className="hover:bg-surface-container-high/50 transition-colors">
                              <td className="py-4 px-6">
                               <div className="flex items-center gap-3">
                                  <div 
                                    className="w-8 h-8 rounded-full border border-outline-variant/20 flex flex-col items-center justify-center font-bold text-xs"
                                    style={{
                                      backgroundColor: `hsl(${asset.symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360}, 40%, 15%)`,
                                      color: `hsl(${asset.symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360}, 80%, 70%)`
                                    }}
                                  >
                                     {asset.symbol[0]}
                                  </div>
                                  <div>
                                    <div className="text-on-surface font-dm font-medium">{asset.symbol}</div>
                                    <div className="text-[10px] text-on-surface-variant">{asset.name}</div>
                                  </div>
                               </div>
                             </td>
                             <td className="py-4 px-6 text-right text-on-surface">{asset.balance.toLocaleString()}</td>
                             <td className="py-4 px-6 text-right text-accent-primary/90">{formatUsd(asset.valueUsd)}</td>
                             <td className={`py-4 px-6 text-right ${asset.change24h >= 0 ? 'text-accent-secondary' : 'text-error'}`}>
                                {asset.change24h > 0 ? '+' : ''}{asset.change24h}%
                             </td>
                             <td className="py-4 px-6 text-right text-on-surface-variant">
                                 <div className="flex items-center justify-end gap-2">
                                  <div className="w-16 h-1 bg-surface-container-highest overflow-hidden">
                                     <motion.div 
                                       className="h-full bg-accent-primary" 
                                       initial={{ width: 0 }}
                                       animate={{ width: `${asset.allocation}%` }}
                                       transition={{ duration: 1, delay: 0.5 + Math.random() * 0.5 }}
                                     />
                                  </div>
                                  <span className="w-10">{asset.allocation}%</span>
                                </div>
                             </td>
                          </StaggerRow>
                       ))}
                    </motion.tbody>
                 </table>
               </div>
            </div>
          </TiltCard>
        </section>

      </div>
    </PageTransition>
  );
}
