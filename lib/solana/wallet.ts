// lib/solana/wallet.ts
import { PublicKey } from '@solana/web3.js';

/**
 * Validate if string is a valid Solana public key
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get wallet address from Phantom (window.solana)
 *
 * IMPORTANT: CLIENT-SIDE ONLY — call inside useEffect or event handlers.
 * Works alongside @solana/wallet-adapter-react. Falls back to window.solana.
 */
export async function getPhantomWalletAddress(): Promise<string | null> {
  // Safety check: server-side guard
  if (typeof window === 'undefined') {
    console.warn('⚠️ getPhantomWalletAddress called on server — skipping');
    return null;
  }

  try {
    const walletAdapter = (window as any).solana;

    if (!walletAdapter) {
      console.error('❌ Phantom wallet not found. Is the extension installed?');
      return null;
    }

    // Already connected
    if (walletAdapter.isConnected && walletAdapter.publicKey) {
      const address = walletAdapter.publicKey.toString();
      console.log('✅ Wallet already connected:', address);
      return address;
    }

    // Request connection
    console.log('🔐 Requesting wallet connection from Phantom...');
    await walletAdapter.connect();

    const address = walletAdapter.publicKey?.toString() ?? null;
    if (address) {
      console.log('✅ Wallet connected:', address);
    }
    return address;
  } catch (error) {
    console.error('❌ Wallet connection failed:', error);
    return null;
  }
}

/**
 * Disconnect Phantom wallet — CLIENT-SIDE ONLY
 */
export async function disconnectPhantomWallet(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const walletAdapter = (window as any).solana;
    if (walletAdapter?.disconnect) {
      await walletAdapter.disconnect();
      console.log('✅ Wallet disconnected');
    }
  } catch (error) {
    console.error('❌ Wallet disconnect failed:', error);
  }
}

/**
 * Extract wallet address string from the @solana/wallet-adapter-react publicKey
 *
 * Usage inside components:
 *   const { publicKey } = useWallet();
 *   const address = getWalletAddressFromAdapter(publicKey);
 */
export function getWalletAddressFromAdapter(publicKey: PublicKey | null): string | null {
  return publicKey?.toString() ?? null;
}
