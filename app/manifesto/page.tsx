'use client';

import { PageTransition } from '@/components/motion/PageTransition';
import { TypewriterText } from '@/components/motion/TypewriterText';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ManifestoPage() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-6 max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-on-surface-variant font-geist text-sm hover:text-accent-primary transition-colors mb-12">
           <ArrowLeft className="w-4 h-4" /> Return
        </Link>
        <h1 className="font-serif italic text-6xl text-on-surface tracking-tighter mb-8">
           The Zero-Log<br/>Mandate.
        </h1>
        <div className="space-y-6 font-dm text-on-surface-variant leading-relaxed">
           <p className="text-xl text-on-surface font-medium border-l-2 border-accent-secondary/50 pl-4">
              Intelligence is useless if your oracle sells your trajectory to the highest bidder.
           </p>
           <p>
              In the modern cryptographic landscape, the most insidious vulnerability is not a smart contract exploit—it is the unchecked leakage of intent. Centralized AI assistants, vector databases, and LLM endpoints act as massive sentiment harvesting engines. They ingest your portfolio geometries, your tax strategies, and your exit vectors. They train on your anxieties and sell your alpha to MEV extraction bots.
           </p>
           <p>
              METIS was built to solve the Oracle's Paradox. How do you query a god-like intelligence without giving it a map to your soul?
           </p>
           <p>
              Our architecture guarantees complete isolation. When you invoke METIS, your data doesn't hit a REST API. It is encrypted on your device and routed directly into a hardware-isolated Secure Enclave (TEE). The model within the enclave runs the inference. It outputs the result. Then, the enclave flushes its volatile memory. 
           </p>
           <div className="font-geist text-sm uppercase tracking-widest text-accent-primary mt-12 mb-4">
              <TypewriterText text="There are no logs. There is no training data. There is only the signal." speed={30} delay={500} />
           </div>
        </div>
      </div>
    </PageTransition>
  )
}
