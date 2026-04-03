'use client';

import { useCallback, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletError } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
    const endpoint = useMemo(() => clusterApiUrl('devnet'), []);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        []
    );

    // Suppress MetaMask / extension errors from polluting the UI
    const onError = useCallback((error: WalletError) => {
        // Only log, never throw — prevents unhandled runtime error overlay
        console.warn('[WalletAdapter] non-fatal error:', error.name, error.message);
    }, []);

    return (
        // @ts-ignore
        <ConnectionProvider endpoint={endpoint}>
            {/* @ts-ignore */}
            <WalletProvider wallets={wallets} autoConnect={false} onError={onError}>
                {/* @ts-ignore */}
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

