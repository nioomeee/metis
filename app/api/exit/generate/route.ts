// app/api/exit/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioSummary } from '@/lib/solana/tokens';
import { encryptAndSendToTEE } from '@/lib/solrouter/encryption';
import { calculateQueryCost, hassufficientBalance } from '@/lib/solrouter/payment';
import { isValidSolanaAddress } from '@/lib/solana/wallet';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, targetValue } = body;

    // ── Validation ───────────────────────────────────────────────────────
    if (!walletAddress || !isValidSolanaAddress(walletAddress)) {
      return NextResponse.json(
        { error: 'Valid wallet address is required' },
        { status: 400 }
      );
    }

    console.log(`🚀 Generating exit strategy for ${walletAddress}...`);

    // ── Step 1: Fetch portfolio ──────────────────────────────────────────
    const portfolio = await getPortfolioSummary(walletAddress);
    if (!portfolio) {
      return NextResponse.json(
        { error: 'Failed to fetch portfolio data from Solana Devnet' },
        { status: 500 }
      );
    }

    // ── Step 2: USDC balance check ───────────────────────────────────────
    const queryCost = calculateQueryCost('exit');
    if (!hassufficientBalance(portfolio.usdc, 'exit')) {
      return NextResponse.json(
        {
          error: 'Insufficient USDC balance for exit strategy',
          required: queryCost,
          available: portfolio.usdc,
          shortfall: parseFloat((queryCost - portfolio.usdc).toFixed(6)),
        },
        { status: 402 }
      );
    }

    // ── Step 3: Encrypt & send to SolRouter TEE ──────────────────────────
    console.log('🔐 Processing exit strategy with SolRouter TEE...');
    const aiResponse = await encryptAndSendToTEE(walletAddress, 'exit', {
      portfolio,
      targetValue: targetValue ?? null,
    });

    console.log('✅ Exit strategy generation completed');

    return NextResponse.json({
      success: true,
      message: 'Exit strategy generated successfully',
      portfolio: {
        usdc: portfolio.usdc,
        sol: portfolio.sol,
        totalValueUSD: portfolio.totalValueUSD,
      },
      targetValue: targetValue ?? null,
      cost: queryCost,
      aiResponse,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('❌ Exit strategy error:', msg);
    return NextResponse.json(
      { error: 'Failed to generate exit strategy', details: msg },
      { status: 500 }
    );
  }
}
