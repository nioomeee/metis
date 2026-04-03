'use client';

import { PageTransition } from '@/components/motion/PageTransition';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { TiltCard } from '@/components/ui/TiltCard';
import { StaggerRow, staggerContainer } from '@/components/motion/StaggerConfig';
import { motion } from 'framer-motion';
import { getMockTaxData } from '@/lib/mockSolRouter';
import { formatUsd } from '@/lib/utils';
import { ShieldAlert, SplitSquareHorizontal, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TaxPage() {
  const [data, setData] = useState<ReturnType<typeof getMockTaxData> | null>(null);

  useEffect(() => {
    setData(getMockTaxData());
  }, []);

  if (!data) return null;

  return (
    <PageTransition>
      <div className="space-y-8">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-serif italic text-4xl text-on-surface mb-2">Tax Phantom Scanner</h2>
              <p className="font-geist text-on-surface-variant text-sm border-l-2 border-accent-primary/50 pl-3 uppercase tracking-widest">
                Liability Detection & Harvest Strategies
              </p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-container p-6 border border-outline-variant/30 border-t-2 border-t-error flex flex-col justify-between">
               <div>
                  <div className="font-geist text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">Estimated Liability</div>
                  <div className="font-serif text-3xl text-error">{formatUsd(data.estimatedLiability)}</div>
               </div>
               <div className="mt-4 pt-4 border-t border-outline-variant/15">
                  <div className="flex justify-between text-[10px] uppercase font-geist text-on-surface-variant mb-1">
                     <span>Effective Rate</span>
                     <span>{data.effectiveTaxRate}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-highest overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${data.effectiveTaxRate}%` }}
                        transition={{ duration: 1.5, delay: 0.2 }}
                        className="h-full bg-error"
                     />
                  </div>
               </div>
            </div>
            <div className="bg-surface-container p-6 border border-outline-variant/30 border-t-2 border-t-accent-secondary">
               <div className="font-geist text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">Realized Gains (YTD)</div>
               <div className="font-serif text-3xl text-on-surface">{formatUsd(data.realizedGains)}</div>
            </div>
            <div className="bg-surface-container p-6 border border-outline-variant/30 border-t-2 border-t-accent-tertiary">
               <div className="font-geist text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">Unrealized Gains</div>
               <div className="font-serif text-3xl text-on-surface">{formatUsd(data.unrealizedGains)}</div>
            </div>
            <div className="bg-surface-container p-6 border border-outline-variant/30 border-t-2 border-t-primary">
               <div className="font-geist text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">Harvest Opportunity</div>
               <div className="font-serif text-3xl text-accent-primary">{formatUsd(data.harvestOpportunity)}</div>
            </div>
         </div>

         <TiltCard className="bg-surface-container-low border-outline-variant/30">
            <div className="border-b border-outline-variant/15 pb-4 p-6">
               <div className="flex items-center gap-3">
                  <SplitSquareHorizontal className="w-5 h-5 text-accent-primary" />
                  <h3 className="text-lg font-dm font-semibold leading-none font-geist uppercase tracking-widest text-sm text-accent-primary">Taxable Events Log</h3>
               </div>
            </div>
            <div className="p-0">
               <div className="overflow-x-auto">
                 <table className="w-full text-left font-ibm text-sm">
                    <thead className="text-[10px] text-on-surface-variant uppercase tracking-widest bg-surface-container-highest/20">
                       <tr>
                          <th className="py-4 px-6 font-medium">Date</th>
                          <th className="py-4 px-6 font-medium text-right">Asset</th>
                          <th className="py-4 px-6 font-medium text-right">Proceeds</th>
                          <th className="py-4 px-6 font-medium text-right">Cost Basis</th>
                          <th className="py-4 px-6 font-medium text-right">Net Gain/Loss</th>
                          <th className="py-4 px-6 font-medium text-right">Term</th>
                       </tr>
                    </thead>
                    <motion.tbody 
                      variants={staggerContainer} 
                      initial="hidden" 
                      animate="show" 
                      className="divide-y divide-outline-variant/10"
                    >
                        {data.events.map((evt, i) => (
                          <StaggerRow 
                            key={i} 
                            className={`hover:bg-surface-container-high/50 transition-colors border-l-2 relative ${evt.gain >= 0 ? "border-l-accent-secondary" : "border-l-error"}`}
                          >
                             <td className="py-4 px-6 text-on-surface-variant">{evt.date}</td>
                             <td className="py-4 px-6 text-right text-on-surface font-dm">{evt.asset}</td>
                             <td className="py-4 px-6 text-right text-on-surface">{formatUsd(evt.proceeds)}</td>
                             <td className="py-4 px-6 text-right text-on-surface-variant">{formatUsd(evt.costBasis)}</td>
                             <td className={`py-4 px-6 text-right font-medium ${evt.gain >= 0 ? 'text-accent-secondary' : 'text-error'}`}>
                                {evt.gain >= 0 ? '+' : ''}{formatUsd(evt.gain)}
                             </td>
                             <td className="py-4 px-6 text-right font-geist relative">
                                <div className="inline-flex px-2 py-0.5 border border-outline-variant/30 text-[10px] uppercase text-on-surface-variant bg-surface-container-lowest">
                                   {evt.gain > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent-secondary animate-ping" />}
                                   {evt.gain > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent-secondary" />}
                                   {evt.term}
                                </div>
                             </td>
                          </StaggerRow>
                       ))}
                    </motion.tbody>
                 </table>
               </div>
            </div>
         </TiltCard>

         <div className="p-4 bg-primary/10 border border-primary/30 flex items-center gap-4">
            <CheckCircle2 className="w-5 h-5 text-accent-primary shrink-0" />
            <div className="font-dm text-sm text-on-surface-variant">
               Scanning complete. 1 active loss-harvesting opportunity detected in $JUP exposure to offset short-term capital gains liability.
            </div>
         </div>
      </div>
    </PageTransition>
  );
}
