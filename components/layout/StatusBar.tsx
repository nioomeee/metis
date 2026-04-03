'use client';

import { useApp } from '@/context/AppContext';

export function StatusBar() {
  const { settings, session } = useApp();

  return (
    <footer className="h-8 border-t border-outline-variant/15 bg-surface-container-lowest flex items-center justify-between px-4 text-[10px] font-geist text-on-surface-variant tracking-widest uppercase">
      <div className="flex items-center gap-6">
        <span>METIS v1.2</span>
        <span className="hidden sm:inline">Encrypted Terminal</span>
      </div>
      
      <div className="flex items-center gap-6">
        <span>RPC: {settings.rpcEndpoint}</span>
        <span>TEE: {settings.teeRegion}</span>
        <span className="text-accent-primary">
          {session.connected ? 'Secure Link' : 'No Connection'}
        </span>
      </div>
    </footer>
  );
}
