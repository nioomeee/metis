'use client';

import { PageTransition } from '@/components/motion/PageTransition';
import { NumberScramble } from '@/components/motion/NumberScramble';
import { TypewriterText } from '@/components/motion/TypewriterText';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { TiltCard } from '@/components/ui/TiltCard';
import { StaggerRow, staggerContainer } from '@/components/motion/StaggerConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { getMockPortfolio } from '@/lib/mockSolRouter';
import { formatUsd, formatSol } from '@/lib/utils';
import {
  Activity, ArrowUpRight, ArrowDownRight, Wallet,
  Brain, ShieldCheck, Loader2, AlertTriangle, Lock, AlertCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useAIQuery } from '@/lib/hooks/useAIQuery';

// ── Health score ring ─────────────────────────────────────────────────────
function HealthScoreWidget({ score }: { score: number }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-14 h-14 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle cx="28" cy="28" r={radius} className="stroke-surface-container-highest" strokeWidth="4" fill="transparent" />
          <motion.circle cx="28" cy="28" r={radius} className="stroke-accent-primary" strokeWidth="4" fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute font-dm font-bold text-sm text-on-surface">{score}</span>
      </div>
      <div>
        <div className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Portfolio Health</div>
        <div className="text-xs text-accent-primary">System Optimal</div>
      </div>
    </div>
  );
}

// ── Inference step ticker ─────────────────────────────────────────────────
function StepTicker({ step }: { step?: string }) {
  return (
    <motion.div key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="flex items-center gap-2 text-[10px] font-ibm uppercase tracking-widest text-accent-primary">
      <Loader2 className="w-3 h-3 animate-spin" />{step}
    </motion.div>
  );
}

export default function PortfolioPage() {
  const { publicKey, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const walletAddress = publicKey?.toString() ?? null;

  // Mock baseline data
  const [data, setData] = useState<ReturnType<typeof getMockPortfolio> | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setData(getMockPortfolio()), 400);
    return () => clearTimeout(t);
  }, []);

  const totalVal = useAnimatedNumber(data?.totalValueUsd ?? 0, 1500, 2);

  // ── AI Query hook ─────────────────────────────────────────────────────
  const { loading, error, success, data: aiData, execute, reset } = useAIQuery({
    walletAddress,
    queryType: 'portfolio',
  });

  const handleAnalyze = () => {
    if (!connected) { setVisible(true); return; }
    reset();
    execute();
  };

  const aiResponse: string | null = aiData?.aiResponse ?? null;
  const apiPortfolio = aiData?.portfolio ?? null;

  if (!data) return null;

  return (
    <PageTransition>
      <div className="space-y-10">

        {/* Hero Stats */}
        <section className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-outline-variant/15 pb-8">
          <div>
            <div className="font-geist text-accent-secondary text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" /> Live Exposure
            </div>
            <div className="font-serif text-5xl md:text-7xl text-on-surface tracking-tighter flex items-center gap-4">
              $<NumberScramble value={totalVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
            </div>
            {connected && apiPortfolio && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center gap-2 text-[10px] font-ibm uppercase tracking-widest text-accent-primary/70">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
                Devnet: {apiPortfolio.sol.toFixed(4)} SOL · {apiPortfolio.usdc.toFixed(2)} USDC
              </motion.div>
            )}
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

        {/* Asset Table */}
        <section>
          <div className="font-geist text-on-surface-variant text-sm border-l-2 border-accent-primary/50 pl-3 uppercase tracking-widest mb-6">
            Asset Topology &amp; Allocation
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
                  <motion.tbody variants={staggerContainer} initial="hidden" animate="show" className="divide-y divide-outline-variant/10">
                    {data.assets.map((asset) => (
                      <StaggerRow key={asset.symbol} className="hover:bg-surface-container-high/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border border-outline-variant/20 flex items-center justify-center font-bold text-xs"
                              style={{
                                backgroundColor: `hsl(${asset.symbol.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360},40%,15%)`,
                                color: `hsl(${asset.symbol.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360},80%,70%)`
                              }}>
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
                              <motion.div className="h-full bg-accent-primary" initial={{ width: 0 }}
                                animate={{ width: `${asset.allocation}%` }}
                                transition={{ duration: 1, delay: 0.5 + Math.random() * 0.5 }} />
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

        {/* SolRouter AI Panel */}
        <section>
          <div className="font-geist text-on-surface-variant text-sm border-l-2 border-accent-secondary/50 pl-3 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Brain className="w-4 h-4 text-accent-secondary" />
            SolRouter Encrypted Intelligence
          </div>
          <TiltCard variant="default" className="relative overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[9px] font-ibm uppercase tracking-widest text-accent-primary/50 border border-accent-primary/20 px-2 py-1">
              <Lock className="w-2.5 h-2.5" /> Zero-Log TEE
            </div>
            <div className="p-6 space-y-5">
              <p className="font-geist text-xs text-on-surface-variant leading-relaxed max-w-2xl">
                Real Devnet balances are fetched, encrypted, and routed through SolRouter TEE nodes.
                0.5 USDC is required per analysis. No logs are retained.
              </p>

              <button id="portfolio-analyze-btn" onClick={handleAnalyze} disabled={loading}
                className="relative group flex items-center gap-2 px-6 py-3 bg-accent-primary/10 border border-accent-primary/40 text-accent-primary font-geist text-xs uppercase tracking-widest hover:bg-accent-primary/20 hover:border-accent-primary/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                {!connected ? 'Connect Wallet to Analyze' : loading ? 'Encrypting & Analyzing...' : 'Generate AI Analysis'}
              </button>

              <AnimatePresence mode="wait">
                {loading && <StepTicker step="ROUTING TO SOLROUTER TEE..." key="step" />}
              </AnimatePresence>

              {/* 402 balance warning */}
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
                      <span className="text-[9px] font-ibm uppercase tracking-widest text-accent-secondary">Verified Enclave Response</span>
                    </div>
                    <div className="p-5 bg-surface-container-lowest border border-outline-variant/20 border-l-2 border-l-accent-primary/60">
                      <TypewriterText text={aiResponse} speed={18}
                        className="font-ibm text-sm text-on-surface/90 leading-relaxed whitespace-pre-wrap" />
                    </div>
                    {apiPortfolio && (
                      <div className="mt-3 flex gap-6 text-[10px] font-ibm text-on-surface-variant uppercase tracking-widest">
                        <span>Cost: <span className="text-accent-primary">0.5 USDC</span></span>
                        <span>SOL: <span className="text-on-surface">{apiPortfolio.sol.toFixed(4)}</span></span>
                        <span>USDC: <span className="text-on-surface">{apiPortfolio.usdc.toFixed(2)}</span></span>
                      </div>
                    )}
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
