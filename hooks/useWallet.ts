'use client';

import { useCallback, useState } from 'react';
import { truncateAddress } from '@/lib/utils';

export function useWallet() {
  const [connected, setConnected] = useState(false);
  const address = connected ? 'METISx1abc123def456xyz' : null;
  const shortAddress = address ? truncateAddress(address) : null;

  const handleConnect = useCallback(async () => {
    setConnected(true);
  }, []);

  const handleDisconnect = useCallback(async () => {
    setConnected(false);
  }, []);

  return {
    publicKey: connected ? { toBase58: () => address } as any : null,
    address,
    shortAddress,
    connected,
    connecting: false,
    disconnecting: false,
    wallet: null,
    wallets: [],
    select: () => {},
    connect: handleConnect,
    disconnect: handleDisconnect,
  };
}
