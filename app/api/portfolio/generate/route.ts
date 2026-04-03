// app/api/portfolio/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioSummary } from '@/lib/solana/tokens';
import { encryptAndSendToTEE } from '@/lib/solrouter/encryption';
import { calculateQueryCost, hassufficientBalance } from '@/lib/solrouter/payment';
import { isValidSolanaAddress } from '@/lib/solana/wallet';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress } = body;

    // ── Validation ───────────────────────────────────────────────────────
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    if (!isValidSolanaAddress(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid Solana wallet address' },
        { status: 400 }
      );
    }

    console.log(`📊 Generating portfolio for ${walletAddress}...`);

    // ── Step 1: Fetch Solana portfolio ───────────────────────────────────
    const portfolio = await getPortfolioSummary(walletAddress);
    if (!portfolio) {
      return NextResponse.json(
        { error: 'Failed to fetch portfolio data from Solana Devnet' },
        { status: 500 }
      );
    }

    // ── Step 2: USDC balance check ───────────────────────────────────────
    const queryCost = calculateQueryCost('portfolio');
    if (!hassufficientBalance(portfolio.usdc, 'portfolio')) {
      return NextResponse.json(
        {
          error: 'Insufficient USDC balance',
          required: queryCost,
          available: portfolio.usdc,
          shortfall: parseFloat((queryCost - portfolio.usdc).toFixed(6)),
        },
        { status: 402 }
      );
    }

    // ── Step 3: Encrypt & send to SolRouter TEE ──────────────────────────
    console.log('🔐 Sending to SolRouter TEE...');
    const aiResponse = await encryptAndSendToTEE(walletAddress, 'portfolio', { portfolio });

    console.log('✅ Portfolio generation completed');

    return NextResponse.json({
      success: true,
      message: 'Portfolio analysis generated successfully',
      portfolio: {
        usdc: portfolio.usdc,
        sol: portfolio.sol,
        totalValueUSD: portfolio.totalValueUSD,
        lastUpdated: portfolio.lastUpdated,
      },
      cost: queryCost,
      aiResponse,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('❌ Portfolio generation error:', msg);
    return NextResponse.json(
      { error: 'Failed to generate portfolio analysis', details: msg },
      { status: 500 }
    );
  }
}
