import { sleep, randomBetween } from './utils';

export type InferenceStatus = 'idle' | 'encrypting' | 'routing' | 'analyzing' | 'done' | 'error';

export interface InferenceStep {
  label: string;
  status: 'pending' | 'active' | 'complete';
}

export interface MockPortfolioData {
  totalValueUsd: number;
  solBalance: number;
  pnl24h: number;
  pnlPercent: number;
  riskScore: number;
  assets: MockAsset[];
}

export interface MockAsset {
  symbol: string;
  name: string;
  balance: number;
  valueUsd: number;
  change24h: number;
  allocation: number;
}

export interface AIResponse {
  sessionId: string;
  encryptionMethod: string;
  teeProvider: string;
  analysis: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendations: string[];
  proof: string;
}

export async function runMockInference(
  onStep: (step: string, status: InferenceStatus) => void
): Promise<AIResponse> {
  const steps = [
    { label: 'LOCAL AGGREGATION', delay: 800 },
    { label: 'AES-GCM ENCRYPTION', delay: 1200 },
    { label: 'TEE HANDSHAKE', delay: 900 },
    { label: 'SECURE ROUTING', delay: 700 },
    { label: 'ENCLAVE INFERENCE', delay: 1500 },
    { label: 'ZERO-LOG DELIVERY', delay: 600 },
  ];

  onStep('Initializing secure session...', 'encrypting');

  for (const step of steps) {
    onStep(step.label, 'routing');
    await sleep(step.delay);
  }

  onStep('Analysis complete', 'done');

  return {
    sessionId: `409-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    encryptionMethod: 'RSA-4096 / TEE',
    teeProvider: 'Intel SGX v2.19',
    analysis:
      'Portfolio risk identified in SOL/USDC liquidity pairs. Volatility index trending +14.2% above baseline. High exposure to unverified sub-assets in Wallet Segment. Strategic Recommendation: Hedge 12% position via decentralized put options or rebalance into stable-liquid yield vaults.',
    riskLevel: 'MEDIUM',
    recommendations: [
      'Hedge 12% SOL exposure via put options on Drift Protocol',
      'Rebalance 8% into USDC yield vaults (4.2% APY)',
      'Monitor 3 low-cap positions flagged as high-volatility',
      'Tax-loss harvest opportunity detected: -$2,340 unrealized loss',
    ],
    proof: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
  };
}

export function getMockPortfolio(): MockPortfolioData {
  return {
    totalValueUsd: 284_750.42,
    solBalance: 1_842.33,
    pnl24h: 12_340.88,
    pnlPercent: 4.53,
    riskScore: 62,
    assets: [
      { symbol: 'SOL', name: 'Solana', balance: 1842.33, valueUsd: 201_120.99, change24h: 5.2, allocation: 70.6 },
      { symbol: 'JTO', name: 'Jito', balance: 4200, valueUsd: 28_350.0, change24h: -2.1, allocation: 9.96 },
      { symbol: 'BONK', name: 'Bonk', balance: 18_400_000, valueUsd: 21_160.0, change24h: 11.4, allocation: 7.43 },
      { symbol: 'WIF', name: 'dogwifhat', balance: 9_800, valueUsd: 19_404.0, change24h: -4.8, allocation: 6.81 },
      { symbol: 'USDC', name: 'USD Coin', balance: 14_715.43, valueUsd: 14_715.43, change24h: 0.01, allocation: 5.17 },
    ],
  };
}

export function getMockTaxData() {
  return {
    estimatedLiability: 38_420.0,
    realizedGains: 156_800.0,
    unrealizedGains: 47_230.0,
    unrealizedLosses: -8_340.0,
    harvestOpportunity: 8_340.0,
    effectiveTaxRate: 24.5,
    events: [
      { date: '2024-03-15', type: 'SELL', asset: 'SOL', proceeds: 24_800, costBasis: 11_200, gain: 13_600, term: 'SHORT' },
      { date: '2024-02-28', type: 'SELL', asset: 'JTO', proceeds: 8_400, costBasis: 3_100, gain: 5_300, term: 'SHORT' },
      { date: '2024-01-10', type: 'SELL', asset: 'BONK', proceeds: 14_200, costBasis: 2_800, gain: 11_400, term: 'LONG' },
    ],
  };
}

export function getMockExitVectors() {
  return {
    positions: [
      {
        asset: 'SOL',
        holding: 1842.33,
        currentPrice: 109.17,
        totalValue: 201_120.99,
        vectors: [
          { label: '10% Exit', size: 184.23, expectedSlippage: 0.02, netProceeds: 20_062.11, timeToExecute: '< 1 min', impact: 'MINIMAL' },
          { label: '25% Exit', size: 460.58, expectedSlippage: 0.08, netProceeds: 49_876.44, timeToExecute: '~ 3 min', impact: 'LOW' },
          { label: '50% Exit', size: 921.17, expectedSlippage: 0.31, netProceeds: 98_203.15, timeToExecute: '~ 8 min', impact: 'MEDIUM' },
          { label: 'Full Exit', size: 1842.33, expectedSlippage: 1.84, netProceeds: 195_127.00, timeToExecute: '~ 22 min', impact: 'HIGH' },
        ],
      },
    ],
  };
}

export function getMockVaultData() {
  return {
    totalLocked: 142_800.0,
    apy: 6.24,
    positions: [
      { protocol: 'Marinade Finance', asset: 'mSOL', amount: 820.14, valueUsd: 89_400.0, apy: 7.1, lockPeriod: 'None' },
      { protocol: 'Jito', asset: 'jitoSOL', amount: 480.0, valueUsd: 53_400.0, apy: 6.8, lockPeriod: 'None' },
    ],
  };
}
