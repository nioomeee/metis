'use client';

import { useState } from 'react';
import { PageTransition } from '@/components/motion/PageTransition';
import { TypewriterText } from '@/components/motion/TypewriterText';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { runMockInference, InferenceStatus } from '@/lib/mockSolRouter';
import { useWallet } from '@/hooks/useWallet';
import { Brain, ShieldAlert, Cpu, Activity, Fingerprint } from 'lucide-react';

export default function IntelligencePage() {
  const { connected } = useWallet();
  const [status, setStatus] = useState<InferenceStatus>('idle');
  const [currentStep, setCurrentStep] = useState<string>('Awaiting Directives');
  const [aiResponse, setAiResponse] = useState<any>(null);

  const handleInference = async () => {
    setStatus('encrypting');
    setAiResponse(null);
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

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header Area */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-serif italic text-4xl text-on-surface mb-2">Submerged Intelligence</h2>
            <p className="font-geist text-on-surface-variant text-sm border-l-2 border-accent-secondary/50 pl-3 uppercase tracking-widest">
              Encrypted AI analysis of your portfolio
            </p>
          </div>
          
          <Button 
            onClick={handleInference}
            disabled={!connected || status === 'encrypting' || status === 'routing'}
            className="group"
          >
            <Brain className="w-4 h-4 mr-2 group-hover:animate-pulse" />
            {(status === 'encrypting' || status === 'routing') ? 'Processing...' : 'Run TEE Inference'}
          </Button>
        </div>

        {/* Inference Terminal */}
        <Card variant="glass" className="border-accent-primary/20 bg-surface-container/40">
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
              <div className="font-geist text-[10px] uppercase text-on-surface-variant flex items-center gap-2">
                <Fingerprint className="w-3 h-3" /> Session ID: {aiResponse.sessionId}
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
                <div className="border-l-2 border-accent-tertiary/50 pl-4 py-1">
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
                         <span className="text-accent-primary font-geist truncate max-w-[120px]">{aiResponse.proof}</span>
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
