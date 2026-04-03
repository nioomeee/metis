import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from '@solana/web3.js';

export const SOLANA_RPC_MAINNET = 'https://api.mainnet-beta.solana.com';
export const SOLANA_RPC_DEVNET = clusterApiUrl('devnet');

export function getConnection(endpoint: string = SOLANA_RPC_MAINNET): Connection {
  return new Connection(endpoint, 'confirmed');
}

export async function getSolBalance(
  publicKey: PublicKey,
  connection: Connection
): Promise<number> {
  try {
    const lamports = await connection.getBalance(publicKey);
    return lamports / LAMPORTS_PER_SOL;
  } catch {
    return 0;
  }
}

export async function getTokenAccounts(
  publicKey: PublicKey,
  connection: Connection
) {
  try {
    const accounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    });
    return accounts.value;
  } catch {
    return [];
  }
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}
