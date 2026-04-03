'use client';

import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';

/**
 * useWallet Hook
 * Proxies the real Solana wallet adapter hook but keeps the METIS app's expected interface.
 */
export function useWallet() {
  const { 
    publicKey, 
    connected, 
    connecting, 
    disconnect, 
    select, 
    wallet, 
    wallets,
    connect
  } = useSolanaWallet();

  const address = publicKey ? publicKey.toBase58() : null;
  
  const shortAddress = useMemo(() => {
    if (!address) return null;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }, [address]);

  return {
    publicKey,
    address,
    shortAddress,
    connected,
    connecting,
    disconnecting: false,
    wallet,
    wallets,
    select,
    connect,
    disconnect,
  };
}
