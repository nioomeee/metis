'use client';

import { PageTransition } from '@/components/motion/PageTransition';
import { TiltCard } from '@/components/ui/TiltCard';
import Link from 'next/link';
import { ArrowLeft, LockKeyhole, Cpu, EyeOff, KeyRound } from 'lucide-react';

export default function SecurityPage() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-6 max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-on-surface-variant font-geist text-sm hover:text-accent-primary transition-colors mb-12">
           <ArrowLeft className="w-4 h-4" /> Return
        </Link>
        <div className="flex items-center gap-3 mb-8">
           <LockKeyhole className="w-8 h-8 text-accent-primary" />
           <h1 className="font-serif italic text-6xl text-on-surface tracking-tighter">Security Protocol</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
           <TiltCard className="p-8 bg-surface-container border border-outline-variant/30 flex flex-col items-start gap-4">
              <KeyRound className="w-6 h-6 text-accent-tertiary" />
              <h3 className="font-medium text-lg font-dm text-on-surface">Client-Side Encryption</h3>
              <p className="font-ibm text-sm text-on-surface-variant leading-relaxed">
                 All portfolio data extracted from your connected Solana wallets is immediately encrypted locally using standard AES-GCM-256 before any request leaves your browser. Your raw addresses and balances never touch a physical wire in plaintext.
              </p>
           </TiltCard>

           <TiltCard className="p-8 bg-surface-container border border-outline-variant/30 flex flex-col items-start gap-4">
              <Cpu className="w-6 h-6 text-accent-secondary" />
              <h3 className="font-medium text-lg font-dm text-on-surface">Remote Enclave Processing</h3>
              <p className="font-ibm text-sm text-on-surface-variant leading-relaxed">
                 The encrypted payload is sent to an Intel SGX or AMD SEV secure enclave. The enclave securely decrypts the data inside its isolated hardware execution environment, runs the AI analysis, and cryptographically signs the output. 
              </p>
           </TiltCard>
        </div>

        <div className="bg-primary/10 border-l-2 border-accent-primary p-6 font-ibm text-sm text-on-surface-variant max-w-2xl">
           <div className="flex items-center gap-3 text-accent-primary mb-2 font-geist uppercase tracking-widest text-[10px]">
              <EyeOff className="w-4 h-4" /> Zero-log Architecture Guarantee
           </div>
           The secure enclave is wiped clean upon inference completion. Absolutely no logs are retained, ensuring that METIS operators, database admins, and web hosts cannot view your financial geometry.
        </div>
      </div>
    </PageTransition>
  )
}
