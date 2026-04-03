'use client';

import { Button } from '@/components/ui/Button';
import { TypewriterText } from '@/components/motion/TypewriterText';
import { PageTransition } from '@/components/motion/PageTransition';
import { useWallet } from '@/hooks/useWallet';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Magnetic } from '@/components/motion/Magnetic';
import { motion } from 'framer-motion';
import { Tilt3D } from '@/components/motion/Tilt3D';
import { MetisLogo } from '@/components/brand/MetisLogo';
import { AuroraBackground } from '@/components/effects/AuroraBackground';

// Reusing a simplified version of Acertinity BackgroundLines for the landing
// (Normally we'd import from Aceternity UI, but here's a pure CSS/SVG placeholder)
function BackgroundLines() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--outline-variant)" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </div>
  );
}

export default function LandingPage() {
  const { connected, connect } = useWallet();
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (connected) {
      router.push('/dashboard/intelligence');
    }
  }, [connected, router]);

  const handleConnect = async () => {
    setIsConnecting(true);
    await connect();
    // Simulate slight routing delay for visual effect
    setTimeout(() => {
      router.push('/dashboard/intelligence');
    }, 400);
  };

  return (
    <PageTransition>
      <main className="min-h-screen relative flex flex-col bg-transparent selection:bg-[#F72585]/30">
        <AuroraBackground />
        
        {/* Navigation / Header simple */}
        <header className="fixed top-0 w-full flex items-center justify-between px-8 py-6 z-50 bg-background/5 backdrop-blur-sm">
          <Magnetic strength={0.4}>
            <Link href="/" className="hover:scale-105 transition-transform cursor-none">
              <MetisLogo size="sm" />
            </Link>
          </Magnetic>
          <div className="hidden md:flex gap-6 font-geist text-xs tracking-widest text-on-surface-variant uppercase items-center">
             <Link href="/system-logs" className="hover:text-accent-primary transition-colors">System Logs</Link>
             <Link href="/network-status" className="hover:text-accent-secondary transition-colors">Network Status</Link>
             <Link href="/security" className="hover:text-accent-tertiary transition-colors">Security</Link>
             <Button variant="ghost" className="text-xs h-8 border-accent-primary/20 hover:border-accent-primary/50" onClick={handleConnect}>
                Connect
             </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative z-10 w-full min-h-screen pt-32 pb-20 px-6 mx-auto text-center flex flex-col items-center justify-center text-pretty">
          <div className="flex flex-col items-center mb-10">
            <MetisLogo size="lg" animated showTagline />
            <div className="inline-flex items-center gap-2 px-3 py-1 mt-6 rounded-full border border-accent-tertiary/20 bg-accent-tertiary/5 font-geist text-[10px] tracking-widest text-accent-tertiary uppercase">
               <span className="w-1.5 h-1.5 rounded-full bg-accent-tertiary animate-pulse" />
               Enclave Network Genesis • V1.0.4
            </div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="font-serif italic text-6xl md:text-9xl leading-tight tracking-tight text-on-surface mb-8 select-none pointer-events-none drop-shadow-2xl"
          >
            Submerged<br />
            Intelligence.
          </motion.h1>

          <div className="max-w-2xl mx-auto mb-12 text-on-surface-variant font-mono text-sm leading-relaxed border-l-2 border-accent-tertiary/50 pl-6 text-left">
            <TypewriterText 
              text="METIS encrypts your portfolio locally before any AI ever sees it. Zero-log inference. Your holdings, your alpha — permanently yours. Centralized vector databases store your net worth in plaintext. LLM providers sell sentiment data derived from your private holdings. MEV bots frontrun transactions."
              speed={20}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
            <Magnetic strength={0.2}>
              <Button 
                 size="lg" 
                 className="metis-liquid-btn px-12 h-14 font-dm font-semibold tracking-wide w-64 shadow-2xl shadow-accent-tertiary/20 group" 
                 onClick={handleConnect}
                 disabled={isConnecting}
              >
                {isConnecting ? (
                   <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Handshake...</span>
                ) : (
                   <span className="group-hover:tracking-widest transition-all duration-300">CONNECT ENCLAVE</span>
                )}
              </Button>
            </Magnetic>
            <Link href="/manifesto" className="text-on-surface-variant font-geist text-xs uppercase tracking-[0.2em] border-b border-outline-variant/30 pb-1 cursor-pointer hover:border-accent-tertiary hover:text-on-surface transition-all">
              Read Manifesto
            </Link>
          </div>
        </section>

        {/* Features Matrix Section */}
        <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-40">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, staggerChildren: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <Tilt3D>
              <div className="metis-card-glass p-10 h-full group hover:-translate-y-2 transition-transform duration-500">
                <div className="w-12 h-12 bg-accent-primary/20 flex items-center justify-center mb-8 border border-accent-primary/30 group-hover:bg-accent-primary/40 transition-colors" style={{ transform: 'translateZ(30px)' }}>
                  <span className="text-[#7B6EF6] font-mono">01</span>
                </div>
                <h3 className="text-2xl font-serif italic mb-4" style={{ transform: 'translateZ(20px)' }}>Edge Encryption</h3>
                <p className="text-sm text-on-surface-variant font-geist leading-relaxed" style={{ transform: 'translateZ(10px)' }}>
                  Data never leaves your browser in plaintext. Our local WASM runtime handles cryptographic sharding before the first packet is sent.
                </p>
              </div>
            </Tilt3D>
            
            <Tilt3D>
              <div className="metis-card-glass p-10 h-full group hover:-translate-y-2 transition-transform duration-500 delay-75">
                <div className="w-12 h-12 bg-accent-tertiary/20 flex items-center justify-center mb-8 border border-accent-tertiary/30 group-hover:bg-accent-tertiary/40 transition-colors" style={{ transform: 'translateZ(30px)' }}>
                  <span className="text-[#F72585] font-mono">02</span>
                </div>
                <h3 className="text-2xl font-serif italic mb-4" style={{ transform: 'translateZ(20px)' }}>TEE Handshakes</h3>
                <p className="text-sm text-on-surface-variant font-geist leading-relaxed" style={{ transform: 'translateZ(10px)' }}>
                  Intelligence is served via nested Trusted Execution Environments. Even the node operator cannot inspect the compute memory.
                </p>
              </div>
            </Tilt3D>

            <Tilt3D>
              <div className="metis-card-glass p-10 h-full group hover:-translate-y-2 transition-transform duration-500 delay-150">
                <div className="w-12 h-12 bg-accent-secondary/20 flex items-center justify-center mb-8 border border-accent-secondary/30 group-hover:bg-accent-secondary/40 transition-colors" style={{ transform: 'translateZ(30px)' }}>
                  <span className="text-[#4CC9F0] font-mono">03</span>
                </div>
                <h3 className="text-2xl font-serif italic mb-4" style={{ transform: 'translateZ(20px)' }}>Zero-Log Mandate</h3>
                <p className="text-sm text-on-surface-variant font-geist leading-relaxed" style={{ transform: 'translateZ(10px)' }}>
                  Stateless inference ensure no vectors are persisted. Once the session ends, the keys are burned and memory is wiped clean.
                </p>
              </div>
            </Tilt3D>
          </motion.div>
        </section>

        {/* Architecture Section */}
        <section className="relative z-10 w-full bg-accent-tertiary/5 py-40 border-y border-outline-variant/10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="max-w-5xl mx-auto px-6 text-center"
          >
            <h2 className="text-4xl md:text-6xl font-serif italic mb-16 tracking-tight">System Topology.</h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-16 relative">
              <Tilt3D>
                <div className="flex flex-col items-center group cursor-pointer" style={{ transform: "translateZ(30px)" }}>
                  <div className="w-24 h-24 rounded-full border border-accent-primary flex items-center justify-center bg-background shadow-[0_0_30px_rgba(123,110,246,0.2)] group-hover:shadow-[0_0_50px_rgba(123,110,246,0.6)] group-hover:scale-110 transition-all duration-300">
                    <span className="text-[10px] font-mono tracking-widest uppercase">Local</span>
                  </div>
                  <span className="mt-6 text-[10px] font-geist uppercase tracking-[0.2em] text-on-surface-variant group-hover:text-accent-primary transition-colors">Edge Sharding</span>
                </div>
              </Tilt3D>
              <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-accent-primary via-accent-tertiary to-accent-secondary opacity-50" />
              <Tilt3D>
                <div className="flex flex-col items-center group cursor-pointer" style={{ transform: "translateZ(30px)" }}>
                  <div className="w-24 h-24 rounded-full border border-accent-tertiary flex items-center justify-center bg-background shadow-[0_0_30px_rgba(247,37,133,0.2)] animate-pulse group-hover:shadow-[0_0_50px_rgba(247,37,133,0.6)] group-hover:scale-110 transition-all duration-300">
                    <span className="text-[10px] font-mono tracking-widest uppercase">Compute</span>
                  </div>
                  <span className="mt-6 text-[10px] font-geist uppercase tracking-[0.2em] text-on-surface-variant group-hover:text-accent-tertiary transition-colors">TEE Enclave</span>
                </div>
              </Tilt3D>
              <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-accent-secondary via-accent-tertiary to-accent-primary opacity-50" />
              <Tilt3D>
                <div className="flex flex-col items-center group cursor-pointer" style={{ transform: "translateZ(30px)" }}>
                  <div className="w-24 h-24 rounded-full border border-accent-secondary flex items-center justify-center bg-background shadow-[0_0_30px_rgba(76,201,240,0.2)] group-hover:shadow-[0_0_50px_rgba(76,201,240,0.6)] group-hover:scale-110 transition-all duration-300">
                    <span className="text-[10px] font-mono tracking-widest uppercase">Alpha</span>
                  </div>
                  <span className="mt-6 text-[10px] font-geist uppercase tracking-[0.2em] text-on-surface-variant group-hover:text-accent-secondary transition-colors">Safe Insights</span>
                </div>
              </Tilt3D>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 w-full py-24 px-12 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-12">
          <MetisLogo size="sm" />
          <div className="text-[10px] font-mono text-on-surface-variant uppercase tracking-[0.4em] text-center md:text-left">
            Submerged Privacy Protocol • Established 2024
          </div>
          <div className="flex gap-10 text-[10px] font-geist uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-accent-tertiary transition-colors">Hardware</a>
            <a href="#" className="hover:text-accent-tertiary transition-colors">Manifesto</a>
            <a href="#" className="hover:text-accent-tertiary transition-colors">Nodes</a>
          </div>
        </footer>

      </main>
    </PageTransition>
  );
}
