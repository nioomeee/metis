import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioSummary } from '@/lib/solana/tokens';
import { isValidSolanaAddress } from '@/lib/solana/wallet';

/**
 * API Route: /api/portfolio/balance
 * Fetches real-time SOL and USDC balances for a given wallet address from Devnet.
 * Used for dashboard displays and AI analysis context.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress } = body;

    // Validate wallet address
    if (!walletAddress || !isValidSolanaAddress(walletAddress)) {
      console.warn('⚠️ Invalid wallet address received:', walletAddress);
      return NextResponse.json(
        { error: 'Valid Solana wallet address is required' },
        { status: 400 }
      );
    }

    console.log(`📊 Fetching balanced for wallet: ${walletAddress}...`);

    // Fetch balances from Solana Devnet
    const portfolio = await getPortfolioSummary(walletAddress);

    if (!portfolio) {
      console.error('❌ Failed to fetch portfolio summary for:', walletAddress);
      return NextResponse.json(
        { error: 'Failed to retrieve portfolio data from Devnet' },
        { status: 500 }
      );
    }

    // Success response
    return NextResponse.json(portfolio);
  } catch (error) {
    console.error('❌ API Error in /api/portfolio/balance:', error);
    return NextResponse.json(
      { error: 'Internal server error during balance fetch' },
      { status: 500 }
    );
  }
}
