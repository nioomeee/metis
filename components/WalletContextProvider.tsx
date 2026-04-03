'use client';

import { useCallback, useMemo, useEffect } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletError } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

/**
 * Global error suppressor for specific browser extension conflicts.
 * This catches MetaMask-triggered runtime errors that can't be handled
 * by the Solana wallet adapter directly.
 */
function useGlobalErrorSuppressor() {
    useEffect(() => {
        const handleUnhandledError = (event: ErrorEvent) => {
            // Check for the specific MetaMask error message
            if (event.message?.includes('Failed to connect to MetaMask') || 
                event.message?.includes('MetaMask') ||
                event.filename?.includes('nkbihfbeogaeaoehlefnkodbefgpgknn')) {
                console.warn('Caught and suppressed a MetaMask extension conflict:', event.message);
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();
                return false;
            }
        };

        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            if (event.reason?.message?.includes('MetaMask') || 
                event.reason?.stack?.includes('nkbihfbeogaeaoehlefnkodbefgpgknn')) {
                console.warn('Caught and suppressed a MetaMask extension rejection:', event.reason?.message);
                event.stopPropagation();
                event.preventDefault();
            }
        };

        window.addEventListener('error', handleUnhandledError, true);
        window.addEventListener('unhandledrejection', handleUnhandledRejection, true);
        
        return () => {
            window.removeEventListener('error', handleUnhandledError, true);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
        };
    }, []);
}

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
    useGlobalErrorSuppressor();
    const endpoint = useMemo(() => clusterApiUrl('devnet'), []);

    // Rely on Wallet Standard for discovery instead of instantiating adapters
    // This often avoids triggers for multichain/EVM discovery in extensions.
    const wallets = useMemo(() => [
        new PhantomWalletAdapter(),
    ], []);

    const onError = useCallback((error: WalletError) => {
        console.warn('[WalletAdapter] suppressed internal error:', error.name, error.message);
    }, []);

    return (
        // @ts-ignore
        <ConnectionProvider endpoint={endpoint}>
            {/* @ts-ignore */}
            <WalletProvider wallets={wallets} autoConnect onError={onError}>
                {/* @ts-ignore */}
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}


