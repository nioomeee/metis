// lib/solana/tokens.ts
import { PublicKey } from '@solana/web3.js';
import solanaConnection from './connection';

/**
 * Official Devnet USDC SPL token mint address
 */
export const USDC_DEVNET_MINT = new PublicKey(
  '4zMMC9srt5Ri5X14GAgipwfYtMxjwNQb755zLvzV5QU'
);

/**
 * Fetch USDC balance for a given wallet address
 * @param walletAddress - Solana wallet address string
 * @returns USDC balance (with decimals)
 */
export async function getUSDCBalance(walletAddress: string): Promise<number> {
  try {
    const publicKey = new PublicKey(walletAddress);

    const tokenAccounts = await solanaConnection.getTokenAccountsByOwner(
      publicKey,
      { mint: USDC_DEVNET_MINT }
    );

    if (tokenAccounts.value.length === 0) {
      console.log('⚠️  No USDC token account found — balance: 0');
      return 0;
    }

    const tokenAccountAddress = tokenAccounts.value[0].pubkey;
    const balance = await solanaConnection.getTokenAccountBalance(tokenAccountAddress);

    const uiAmount = balance.value.uiAmount ?? 0;
    console.log(`✅ USDC Balance fetched: ${uiAmount}`);
    return uiAmount;
  } catch (error) {
    console.error('❌ Error fetching USDC balance:', error);
    return 0;
  }
}

/**
 * Fetch SOL balance for a given wallet address
 * @param walletAddress - Solana wallet address string
 * @returns SOL amount (not lamports)
 */
export async function getSOLBalance(walletAddress: string): Promise<number> {
  try {
    const publicKey = new PublicKey(walletAddress);
    const balanceLamports = await solanaConnection.getBalance(publicKey);

    const solAmount = balanceLamports / 1_000_000_000; // 1 SOL = 1B lamports
    console.log(`✅ SOL Balance fetched: ${solAmount}`);
    return solAmount;
  } catch (error) {
    console.error('❌ Error fetching SOL balance:', error);
    return 0;
  }
}

/**
 * Get a combined portfolio summary for a wallet
 * @param walletAddress - Solana wallet address string
 */
export async function getPortfolioSummary(walletAddress: string) {
  try {
    const [usdcBalance, solBalance] = await Promise.all([
      getUSDCBalance(walletAddress),
      getSOLBalance(walletAddress),
    ]);

    const SOL_PRICE_USD = 150; // Demo price — replace with live oracle
    const totalValueUSD = Math.round((usdcBalance + solBalance * SOL_PRICE_USD) * 100) / 100;

    const portfolio = {
      usdc: usdcBalance,
      sol: solBalance,
      totalValueUSD,
      lastUpdated: new Date().toISOString(),
    };

    console.log('✅ Portfolio summary:', portfolio);
    return portfolio;
  } catch (error) {
    console.error('❌ Error building portfolio summary:', error);
    return null;
  }
}
