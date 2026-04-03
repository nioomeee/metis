'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { Loader2, Wallet, LogOut } from 'lucide-react';

/**
 * Connect Wallet Button
 * Shows wallet address when connected, connect button when not
 * Styled for the METIS Abyssal Design System
 */
export function ConnectWalletButton() {
  const { publicKey, disconnect, connecting, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-32 bg-surface-container-highest/20 rounded animate-pulse border border-outline-variant/30" />
    );
  }

  // Connected state
  if (connected && publicKey) {
    const address = publicKey.toString();
    const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;

    return (
      <div className="flex items-center gap-2">
        <div className="px-4 py-2 bg-accent-primary/10 border border-accent-primary/30 text-accent-primary rounded-none font-geist text-[10px] tracking-widest uppercase flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
          {shortAddress}
        </div>
        <button
          onClick={() => disconnect()}
          className="p-2 hover:bg-error/10 hover:text-error text-on-surface-variant transition-colors border border-transparent hover:border-error/20"
          title="Disconnect Wallet"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  // Disconnected/Connecting state
  return (
    <button
      onClick={() => setVisible(true)}
      disabled={connecting}
      className="metis-btn-ghost px-6 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      {connecting ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-accent-primary" />
          <span className="font-geist text-[10px] tracking-widest uppercase">Handshake...</span>
        </>
      ) : (
        <>
          <Wallet className="w-3.5 h-3.5 group-hover:text-accent-primary transition-colors" />
          <span className="font-geist text-[10px] tracking-widest uppercase group-hover:tracking-[0.15em] transition-all">Connect Enclave</span>
        </>
      )}
    </button>
  );
}
