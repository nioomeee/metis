// lib/solrouter/payment.ts

/**
 * AI query cost table (in USDC)
 */
const QUERY_COSTS: Record<string, number> = {
  portfolio: 0.5,
  tax: 1.0,
  exit: 2.0,
};

const DEFAULT_COST = 0.25;

/**
 * Calculate the USDC cost for a given query type
 */
export function calculateQueryCost(queryType: string): number {
  const cost = QUERY_COSTS[queryType];
  if (cost === undefined) {
    console.warn(`⚠️ Unknown query type "${queryType}" — defaulting to ${DEFAULT_COST} USDC`);
    return DEFAULT_COST;
  }
  return cost;
}

/**
 * Check whether the user has enough USDC for a given query
 */
export function hassufficientBalance(
  availableBalance: number,
  queryType: string
): boolean {
  return availableBalance >= calculateQueryCost(queryType);
}

/**
 * Format a USDC amount for display
 */
export function formatPaymentAmount(amount: number): string {
  return `$${amount.toFixed(2)} USDC`;
}

/**
 * Return a full payment summary object for display in UI
 */
export function getPaymentSummary(availableBalance: number, queryType: string) {
  const cost = calculateQueryCost(queryType);
  const isAffordable = hassufficientBalance(availableBalance, queryType);
  const remainingBalance = Math.max(0, availableBalance - cost);

  return {
    cost,
    costFormatted: formatPaymentAmount(cost),
    availableBalance,
    isAffordable,
    remainingBalance,
    remainingFormatted: formatPaymentAmount(remainingBalance),
  };
}

/**
 * Create a local payment record (for logging / UI display)
 * In production this would be replaced by an on-chain USDC transfer.
 */
export function createPaymentRecord(walletAddress: string, queryType: string) {
  return {
    walletAddress,
    queryType,
    amount: calculateQueryCost(queryType),
    timestamp: new Date().toISOString(),
    status: 'pending' as const,
  };
}
