'use client';

import { PageTransition } from '@/components/motion/PageTransition';
import { TypewriterText } from '@/components/motion/TypewriterText';
import Link from 'next/link';
import { ArrowLeft, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';

const mockLogs = [
  '[SYS] Initializing enclave handshake protocol...',
  '[SEC] Establishing AES-GCM 256 channel over TLS 1.3',
  '[NODE] Connection routed via SGX relay #04',
  '[MEM] Zeroizing redundant inference buffers',
  '[DATA] Received encrypted portfolio geometry graph',
  '[INFERENCE] Vector distance processing (duration: 412ms)',
  '[TX] Generating simulated routing matrices for Jupiter swap',
  '[SEC] Ephemeral decryption key destroyed',
  '[SYS] Awaiting new directive parameters...',
];

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
       if (index < mockLogs.length) {
          setLogs(prev => [...prev, mockLogs[index]]);
          index++;
       } else {
          clearInterval(interval);
       }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-6 max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-on-surface-variant font-geist text-sm hover:text-accent-primary transition-colors mb-12">
           <ArrowLeft className="w-4 h-4" /> Return
        </Link>
        <div className="flex items-center gap-3 mb-8">
           <Terminal className="w-6 h-6 text-accent-secondary" />
           <h1 className="font-geist uppercase tracking-widest text-sm text-accent-secondary">Global Enclave Stream</h1>
        </div>
        
        <div className="bg-surface-container-low border border-outline-variant/30 p-6 min-h-[400px] font-ibm text-sm space-y-2">
           {logs.map((log, i) => (
              <div key={i} className={log.includes('[SEC]') ? 'text-accent-tertiary' : 'text-on-surface-variant'}>
                 <TypewriterText text={`> ${log}`} speed={20} cursor={i === logs.length - 1} />
              </div>
           ))}
           <div className="animate-pulse w-2 h-4 bg-accent-primary mt-4" style={{ display: logs.length === mockLogs.length ? 'block' : 'none' }} />
        </div>
      </div>
    </PageTransition>
  )
}
