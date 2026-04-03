'use client';

import { useWallet } from '@/hooks/useWallet';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { StatusDot } from '../ui/StatusDot';
import { Magnetic } from '../motion/Magnetic';
import Link from 'next/link';
import { MetisLogo } from '../brand/MetisLogo';

export function TopBar() {
  const pathname = usePathname();
  const { connected, connect } = useWallet();

  const getPageTitle = () => {
    if (pathname.includes('/intelligence')) return 'Submerged Intelligence';
    if (pathname.includes('/portfolio')) return 'Portfolio Asset Topology';
    if (pathname.includes('/vault')) return 'Vault Control Center';
    if (pathname.includes('/tax')) return 'Tax Phantom Scanner';
    if (pathname.includes('/exit')) return 'Exit Vector Modeling';
    if (pathname.includes('/settings')) return 'System Settings';
    return 'Control Center';
  };

  return (
    <header className="h-16 w-full border-b border-outline-variant/15 flex items-center justify-between px-6 bg-surface/80 backdrop-blur-md z-40 sticky top-0">
      <div className="flex items-center gap-4">
          <Magnetic strength={0.1}>
            <Link href="/" className="hover:text-accent-primary transition-colors cursor-none md:hidden mr-4">
              <MetisLogo size="sm" />
            </Link>
          </Magnetic>
         <h1 className="font-dm font-medium text-on-surface tracking-wide">
          {getPageTitle()}
         </h1>
         <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full border border-outline-variant/30 bg-surface-container-lowest">
          <StatusDot status={connected ? 'active' : 'offline'} pulse={connected} />
          <span className="text-[10px] font-geist text-on-surface-variant uppercase tracking-widest">
            {connected ? 'Enclave Active' : 'Offline'}
          </span>
         </div>
      </div>

      <div className="flex items-center gap-4">
         <div className="metis-wallet-wrapper">
          <button 
             onClick={connect}
             className="wallet-adapter-button" 
             style={{ backgroundColor: 'var(--surface-container-high)', borderRadius: '0px', height: '40px', padding: '0 24px', color: 'white', fontFamily: 'var(--font-dm)' }}>
             {connected ? 'Connected' : 'Select Wallet'}
          </button>
         </div>
      </div>
    </header>
  );
}
