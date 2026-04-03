'use client';

import { PageTransition } from '@/components/motion/PageTransition';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { useApp } from '@/context/AppContext';
import { Settings as SettingsIcon, Shield, Server, EyeOff, LayoutPanelLeft } from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, isHydrated } = useApp();

  if (!isHydrated) return null;

  return (
    <PageTransition>
      <div className="space-y-8 max-w-4xl">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-serif italic text-4xl text-on-surface mb-2">System Configuration</h2>
              <p className="font-geist text-on-surface-variant text-sm border-l-2 border-outline-variant/50 pl-3 uppercase tracking-widest">
                Enclave Preferences & RPC Routing
              </p>
            </div>
         </div>

         <div className="grid grid-cols-1 gap-6">
            <Card className="bg-surface-container-low border-outline-variant/20">
               <CardHeader className="border-b border-outline-variant/10 pb-4">
                  <div className="flex items-center gap-3">
                     <Server className="w-5 h-5 text-on-surface" />
                     <CardTitle className="font-geist uppercase tracking-widest text-sm text-on-surface">Network & Node Routing</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <div className="font-dm font-medium text-sm text-on-surface mb-1">RPC Endpoint Selection</div>
                        <div className="font-ibm text-xs text-on-surface-variant max-w-md">Override default Solana public RPCs with your own private node connection to prevent mempool tracking.</div>
                     </div>
                     <select 
                       className="bg-surface-container-highest border border-outline-variant/30 text-xs font-geist text-on-surface px-3 py-2 outline-none focus:border-accent-primary"
                       value={settings.rpcEndpoint}
                       onChange={(e) => updateSettings({ rpcEndpoint: e.target.value as any })}
                     >
                        <option value="mainnet">Mainnet-beta (Default)</option>
                        <option value="devnet">Devnet</option>
                        <option value="custom">Custom Node URL...</option>
                     </select>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                     <div>
                        <div className="font-dm font-medium text-sm text-on-surface mb-1">Enclave Geographic Region</div>
                        <div className="font-ibm text-xs text-on-surface-variant max-w-md">Select the physical location of the secure enclave that processes your portfolio intelligence.</div>
                     </div>
                     <select 
                       className="bg-surface-container-highest border border-outline-variant/30 text-xs font-geist text-on-surface px-3 py-2 outline-none focus:border-accent-primary"
                       value={settings.teeRegion}
                       onChange={(e) => updateSettings({ teeRegion: e.target.value as any })}
                     >
                        <option value="us-east">US-East (Intel SGX)</option>
                        <option value="eu-west">EU-West (Intel SGX)</option>
                        <option value="ap-south">AP-South (AMD SEV)</option>
                     </select>
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-surface-container-low border-outline-variant/20">
               <CardHeader className="border-b border-outline-variant/10 pb-4">
                  <div className="flex items-center gap-3">
                     <Shield className="w-5 h-5 text-on-surface" />
                     <CardTitle className="font-geist uppercase tracking-widest text-sm text-on-surface">Privacy & Obfuscation</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="flex gap-4">
                        <EyeOff className="w-5 h-5 text-on-surface-variant shrink-0" />
                        <div>
                           <div className="font-dm font-medium text-sm text-on-surface mb-1">Strict Privacy Mode</div>
                           <div className="font-ibm text-xs text-on-surface-variant max-w-md">Disables all diagnostic telemetry and forces tor-routing for API requests to exchange rates.</div>
                        </div>
                     </div>
                     <Toggle 
                       checked={settings.privacyMode} 
                       onCheckedChange={(v) => updateSettings({ privacyMode: v })} 
                     />
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                     <div className="flex gap-4">
                        <LayoutPanelLeft className="w-5 h-5 text-on-surface-variant shrink-0" />
                        <div>
                           <div className="font-dm font-medium text-sm text-on-surface mb-1">Reduced Motion UI</div>
                           <div className="font-ibm text-xs text-on-surface-variant max-w-md">Disables scanlines, background blobs, and type-writer effects for maximum hardware efficiency.</div>
                        </div>
                     </div>
                     <Toggle 
                       checked={settings.reducedMotion} 
                       onCheckedChange={(v) => updateSettings({ reducedMotion: v })} 
                     />
                  </div>
               </CardContent>
            </Card>
         </div>

      </div>
    </PageTransition>
  );
}
