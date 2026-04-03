'use client';

import { useState } from 'react';
import { PageTransition } from '@/components/motion/PageTransition';
import { TypewriterText } from '@/components/motion/TypewriterText';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { runMockInference, InferenceStatus } from '@/lib/mockSolRouter';
import { useWallet } from '@/hooks/useWallet';
import { Brain, ShieldAlert, Cpu, Activity, Fingerprint, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

function Grid16({ status }: { status: InferenceStatus }) {
  const getActiveCount = () => {
    switch (status) {
      case 'idle': return 0;
      case 'encrypting': return 4;
      case 'routing': return 10;
      case 'analyzing': return 14;
      case 'done': return 16;
      case 'error': return 0;
      default: return 0;
    }
  };
  const activeCount = getActiveCount();
  return (
    <div className="grid grid-cols-4 gap-1 w-16 h-16 opacity-50">
      {Array.from({ length: 16 }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "w-3 h-3 rounded-[1px] transition-all duration-500",
            i < activeCount 
              ? (status === 'encrypting' ? 'bg-accent-secondary animate-pulse' : 'bg-accent-primary')
              : "bg-surface-container-highest"
          )}
        />
      ))}
    </div>
  );
}

export default function IntelligencePage() {
  const { connected } = useWallet();
  const [status, setStatus] = useState<InferenceStatus>('idle');
  const [currentStep, setCurrentStep] = useState<string>('Awaiting Directives');
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleInference = async () => {
    setStatus('encrypting');
    setAiResponse(null);
    setCopied(false);
    try {
      const result = await runMockInference((step, newStatus) => {
        setCurrentStep(step);
        setStatus(newStatus);
      });
      setAiResponse(result);
    } catch {
      setStatus('error');
    }
  };

  const handleCopy = () => {
    if (aiResponse) {
      navigator.clipboard.writeText(aiResponse.analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] rotate-[-15deg] z-0 select-none">
          <span style={{ fontFamily: 'var(--font-cormorant)' }} className="text-9xl font-bold tracking-widest whitespace-nowrap">
            CLASSIFIED
          </span>
        </div>

        {/* Header Area */}
        <div className="flex items-start justify-between relative z-10">
          <div>
            <h2 className="font-serif italic text-4xl text-on-surface mb-2">Submerged Intelligence</h2>
            <p className="font-geist text-on-surface-variant text-sm border-l-2 border-accent-secondary/50 pl-3 uppercase tracking-widest">
              Encrypted AI analysis of your portfolio
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <Grid16 status={status} />
            <Button 
              onClick={handleInference}
              disabled={!connected || status === 'encrypting' || status === 'routing'}
              className="group"
            >
              <Brain className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              {(status === 'encrypting' || status === 'routing') ? 'Processing...' : 'Run TEE Inference'}
            </Button>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="relative overflow-hidden rounded-sm border border-outline-variant/30 bg-surface-container/40 backdrop-blur-sm">
            <textarea 
              className="w-full bg-transparent p-4 text-on-surface font-ibm text-sm resize-none focus:outline-none min-h-[100px]"
              placeholder="Enter analysis directives..."
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <AnimatePresence>
              {isFocused && (
                <motion.div 
                  initial={{ top: -10 }}
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                  className="absolute left-0 right-0 h-[2px] bg-accent-primary/50 shadow-[0_0_8px_var(--accent-primary)] pointer-events-none"
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Inference Terminal */}
        <Card variant="glass" className="border-accent-primary/20 bg-surface-container/40 relative z-10">
          <CardHeader className="border-b border-outline-variant/15 flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-accent-primary" />
              <CardTitle className="font-geist uppercase tracking-widest text-sm text-accent-primary flex items-center gap-2">
                System Inference Log
                {(status === 'encrypting' || status === 'routing') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-ping ml-2"/>
                )}
              </CardTitle>
            </div>
            {aiResponse && (
              <div className="flex items-center gap-4">
                <div className="font-geist text-[10px] uppercase text-on-surface-variant flex items-center gap-2">
                  <Fingerprint className="w-3 h-3" /> Session ID: <span className="font-mono-numbers">{aiResponse.sessionId}</span>
                </div>
                <button 
                  onClick={handleCopy}
                  className="text-on-surface-variant hover:text-accent-primary transition-colors flex items-center gap-1.5 border border-outline-variant/20 px-2 py-1 rounded-sm bg-surface-container text-xs"
                >
                  {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-6 font-ibm text-sm leading-relaxed text-on-surface-variant min-h-[160px]">
            {status === 'idle' && !aiResponse && (
              <TypewriterText text="[SYS] Standing by. Secure Enclave verified. Waiting for portfolio decryption keys..." speed={15} />
            )}
            
            {(status === 'encrypting' || status === 'routing') && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-accent-secondary">
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>{currentStep}</span>
                </div>
                <div className="w-full h-1 bg-surface-container-highest mt-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-1/3 bg-accent-secondary animate-[slide_1s_infinite_ease-in-out]" style={{
                     animationName: "slide"
                  }}/>
                  <style>{`
                    @keyframes slide {
                      0% { transform: translateX(-100%); }
                      100% { transform: translateX(300%); }
                    }
                  `}</style>
                </div>
              </div>
            )}

            {aiResponse && (
              <div className="space-y-6">
                <div className="border-l-2 border-accent-tertiary/50 pl-4 py-1 relative group">
                  <p className="text-on-surface">
                    <span className="text-accent-tertiary">[ANALYSIS]</span> {aiResponse.analysis}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-3">
                      <div className="font-geist text-[10px] uppercase tracking-widest text-accent-primary">Recommendations</div>
                      <ul className="space-y-2">
                        {aiResponse.recommendations.map((rec: string, i: number) => (
                           <li key={i} className="flex gap-2 text-sm text-on-surface">
                              <span className="text-outline-variant">--</span> {rec}
                           </li>
                        ))}
                      </ul>
                   </div>
                   
                   <div className="p-4 bg-surface-container-lowest border border-outline-variant/10 rounded-sm space-y-3">
                      <div className="flex items-center gap-2 font-geist text-[10px] uppercase tracking-widest text-accent-secondary mb-2">
                         <ShieldAlert className="w-3 h-3" /> Security Proof
                      </div>
                      <div className="flex justify-between items-center text-xs">
                         <span className="text-on-surface-variant">Method</span>
                         <span className="text-on-surface font-geist">{aiResponse.encryptionMethod}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                         <span className="text-on-surface-variant">Isolation Level</span>
                         <span className="text-on-surface font-geist">{aiResponse.teeProvider}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-t border-outline-variant/15 mt-2 pt-2">
                         <span className="text-on-surface-variant">Hash</span>
                         <span className="text-accent-primary font-geist truncate max-w-[120px] font-mono-numbers">{aiResponse.proof}</span>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </PageTransition>
  );
}
