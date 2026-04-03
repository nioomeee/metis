'use client';

import { PageTransition } from '@/components/motion/PageTransition';
import { TiltCard } from '@/components/ui/TiltCard';
import Link from 'next/link';
import { ArrowLeft, Server, Activity, Database, CheckCircle2 } from 'lucide-react';

export default function NetworkStatusPage() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
           <Link href="/" className="inline-flex items-center gap-2 text-on-surface-variant font-geist text-sm hover:text-accent-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> Return
           </Link>
           <div className="px-3 py-1 flex items-center gap-2 rounded-sm border border-accent-secondary/30 bg-accent-secondary/10">
              <span className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse" />
              <span className="font-geist text-xs uppercase tracking-widest text-accent-secondary">All Systems Operational</span>
           </div>
        </div>

        <h1 className="font-serif italic text-5xl text-on-surface mb-8">Network Status</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <TiltCard className="p-6 bg-surface-container-low border border-outline-variant/30">
              <Server className="w-6 h-6 text-on-surface-variant mb-4" />
              <div className="font-geist text-xs text-on-surface-variant uppercase tracking-widest mb-1">TEE Nodes Active</div>
              <div className="font-ibm text-3xl text-on-surface">1,042</div>
           </TiltCard>
           <TiltCard className="p-6 bg-surface-container-low border border-outline-variant/30">
              <Activity className="w-6 h-6 text-on-surface-variant mb-4" />
              <div className="font-geist text-xs text-on-surface-variant uppercase tracking-widest mb-1">Global Latency</div>
              <div className="font-ibm text-3xl text-accent-secondary">38ms</div>
           </TiltCard>
           <TiltCard className="p-6 bg-surface-container-low border border-outline-variant/30">
              <Database className="w-6 h-6 text-on-surface-variant mb-4" />
              <div className="font-geist text-xs text-on-surface-variant uppercase tracking-widest mb-1">Stored Logs</div>
              <div className="font-ibm text-3xl text-accent-primary">0 Bytes</div>
           </TiltCard>
        </div>

        <div className="bg-surface-container border border-outline-variant/30 p-6 space-y-4 font-geist text-sm text-on-surface">
           <div className="flex justify-between items-center pb-4 border-b border-outline-variant/15">
              <span>Intel SGX Cluster (US-East)</span>
              <CheckCircle2 className="w-4 h-4 text-accent-secondary" />
           </div>
           <div className="flex justify-between items-center pb-4 border-b border-outline-variant/15">
              <span>AMD SEV Enclaves (EU-West)</span>
              <CheckCircle2 className="w-4 h-4 text-accent-secondary" />
           </div>
           <div className="flex justify-between items-center pb-4 border-b border-outline-variant/15">
              <span>Mock Inference Engine (Local)</span>
              <CheckCircle2 className="w-4 h-4 text-accent-secondary" />
           </div>
        </div>
      </div>
    </PageTransition>
  )
}
