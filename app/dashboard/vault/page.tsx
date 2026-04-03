'use client';

import { PageTransition } from '@/components/motion/PageTransition';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getMockVaultData } from '@/lib/mockSolRouter';
import { formatUsd } from '@/lib/utils';
import { Lock, AlertCircle, Percent, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function VaultPage() {
  const [data, setData] = useState<ReturnType<typeof getMockVaultData> | null>(null);

  useEffect(() => {
    setData(getMockVaultData());
  }, []);

  if (!data) return null;

  return (
    <PageTransition>
      <div className="space-y-8">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-serif italic text-4xl text-on-surface mb-2">Vault Control Center</h2>
              <p className="font-geist text-on-surface-variant text-sm border-l-2 border-accent-tertiary/50 pl-3 uppercase tracking-widest">
                Yield Aggregation & Risk Minimization
              </p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="glass" className="md:col-span-2 border-outline-variant/30">
               <CardHeader className="border-b border-outline-variant/15 pb-4">
                  <div className="flex items-center gap-3">
                     <Lock className="w-5 h-5 text-accent-secondary" />
                     <CardTitle className="font-geist uppercase tracking-widest text-sm text-accent-secondary">Active Yield Positions</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <table className="w-full text-left font-ibm text-sm">
                     <thead className="text-[10px] text-on-surface-variant uppercase tracking-widest bg-surface-container-lowest/50">
                        <tr>
                           <th className="py-4 px-6 font-medium">Protocol</th>
                           <th className="py-4 px-6 font-medium text-right">Asset</th>
                           <th className="py-4 px-6 font-medium text-right">Value (USD)</th>
                           <th className="py-4 px-6 font-medium text-right">Net APY</th>
                           <th className="py-4 px-6 font-medium text-right">Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-outline-variant/10">
                        {data.positions.map((pos) => (
                           <tr key={pos.protocol} className="hover:bg-surface-container-high/50 transition-colors">
                              <td className="py-4 px-6 text-on-surface">{pos.protocol}</td>
                              <td className="py-4 px-6 text-right text-on-surface-variant">{pos.asset}</td>
                              <td className="py-4 px-6 text-right text-accent-primary/90">{formatUsd(pos.valueUsd)}</td>
                              <td className="py-4 px-6 text-right text-accent-secondary">+{pos.apy}%</td>
                              <td className="py-4 px-6 text-right font-geist">
                                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-accent-secondary/10 border border-accent-secondary/20 text-accent-secondary text-[10px] uppercase">
                                   <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" /> Live
                                </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </CardContent>
            </Card>

            <Card className="flex flex-col bg-surface-container border-outline-variant/30">
               <CardHeader className="border-b border-outline-variant/15 pb-4 bg-surface-container-lowest/50">
                  <div className="flex items-center gap-3">
                     <Percent className="w-5 h-5 text-accent-tertiary" />
                     <CardTitle className="font-geist uppercase tracking-widest text-sm text-accent-tertiary">Metrics</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="flex-1 flex flex-col justify-center p-6 space-y-8">
                  <div>
                     <div className="font-geist text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">Total Locked Value</div>
                     <div className="font-serif text-4xl text-on-surface">{formatUsd(data.totalLocked)}</div>
                  </div>
                  <div>
                     <div className="font-geist text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">Blended APY</div>
                     <div className="font-serif text-4xl text-accent-secondary">+{data.apy}%</div>
                  </div>
               </CardContent>
            </Card>
         </div>

         <div className="p-6 bg-error/10 border border-error/30 rounded-none flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex gap-4 items-start">
               <AlertCircle className="w-6 h-6 text-error shrink-0 mt-0.5" />
               <div>
                  <div className="font-geist text-sm text-error uppercase tracking-widest mb-1">Exposure Warning</div>
                  <div className="font-dm text-sm text-on-surface-variant leading-relaxed">
                     Lending pool utilizing your USDC is carrying high-risk, uncollateralized fractional reserves over 12%. Immediate rebalancing to direct staked SOL is recommended.
                  </div>
               </div>
            </div>
            <Button variant="danger" className="shrink-0 group">
               EXECUTE REBALANCE <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
         </div>

      </div>
    </PageTransition>
  );
}
