// lib/solana/connection.ts
import { Connection, clusterApiUrl } from '@solana/web3.js';

/**
 * Solana Devnet connection singleton
 * Reused across all backend operations to avoid creating multiple connections
 */
export const solanaConnection = new Connection(
  clusterApiUrl('devnet'),
  'confirmed'
);

/**
 * Verify Solana connection is active
 * @returns true if connected, false if not
 */
export async function verifyConnection(): Promise<boolean> {
  try {
    const version = await solanaConnection.getVersion();
    console.log('✅ Solana Devnet Connected. Version:', version);
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Solana Devnet:', error);
    return false;
  }
}

export default solanaConnection;
