'use client';

import { useState } from 'react';

export type QueryType = 'portfolio' | 'tax' | 'exit';

interface UseAIQueryOptions {
  walletAddress: string | null;
  queryType: QueryType;
  params?: Record<string, any>;
}

interface UseAIQueryResult {
  loading: boolean;
  error: string | null;
  success: boolean;
  data: any | null;
  execute: () => Promise<void>;
  reset: () => void;
}

/**
 * React hook that calls /api/{queryType}/generate and manages state.
 *
 * Usage:
 *   const { loading, error, data, execute } = useAIQuery({
 *     walletAddress: publicKey?.toString() ?? null,
 *     queryType: 'portfolio',
 *   });
 *
 *   <button onClick={execute} disabled={loading || !walletAddress}>
 *     {loading ? 'Generating...' : 'Generate'}
 *   </button>
 */
export function useAIQuery({
  walletAddress,
  queryType,
  params = {},
}: UseAIQueryOptions): UseAIQueryResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<any | null>(null);

  const execute = async () => {
    if (!walletAddress) {
      setError('Wallet address is required. Please connect your wallet first.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setData(null);

    try {
      console.log(`🚀 Executing ${queryType} query for wallet ${walletAddress}...`);

      const response = await fetch(`/api/${queryType}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, ...params }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error || `Query failed with status ${response.status}`
        );
      }

      setData(responseData);
      setSuccess(true);
      console.log(`✅ ${queryType} query successful:`, responseData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      console.error(`❌ ${queryType} query failed:`, message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setData(null);
  };

  return { loading, error, success, data, execute, reset };
}
