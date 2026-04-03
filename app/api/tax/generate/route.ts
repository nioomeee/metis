// app/api/tax/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUSDCBalance } from '@/lib/solana/tokens';
import { encryptAndSendToTEE } from '@/lib/solrouter/encryption';
import { calculateQueryCost, hassufficientBalance } from '@/lib/solrouter/payment';
import { isValidSolanaAddress } from '@/lib/solana/wallet';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, year } = body;

    // ── Validation ───────────────────────────────────────────────────────
    if (!walletAddress || !isValidSolanaAddress(walletAddress)) {
      return NextResponse.json(
        { error: 'Valid wallet address is required' },
        { status: 400 }
      );
    }

    const taxYear = year || new Date().getFullYear();
    console.log(`📈 Generating tax analysis for ${walletAddress} (year: ${taxYear})...`);

    // ── Step 1: USDC balance check ───────────────────────────────────────
    const usdcBalance = await getUSDCBalance(walletAddress);
    const queryCost = calculateQueryCost('tax');

    if (!hassufficientBalance(usdcBalance, 'tax')) {
      return NextResponse.json(
        {
          error: 'Insufficient USDC balance for tax analysis',
          required: queryCost,
          available: usdcBalance,
          shortfall: parseFloat((queryCost - usdcBalance).toFixed(6)),
        },
        { status: 402 }
      );
    }

    // ── Step 2: Encrypt & send to SolRouter TEE ──────────────────────────
    console.log('🔐 Processing tax data with SolRouter TEE...');
    const aiResponse = await encryptAndSendToTEE(walletAddress, 'tax', {
      year: taxYear,
      usdcBalance,
    });

    console.log('✅ Tax analysis completed');

    return NextResponse.json({
      success: true,
      message: 'Tax analysis generated successfully',
      year: taxYear,
      cost: queryCost,
      aiResponse,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('❌ Tax analysis error:', msg);
    return NextResponse.json(
      { error: 'Failed to generate tax analysis', details: msg },
      { status: 500 }
    );
  }
}
