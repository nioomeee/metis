// lib/solrouter/client.ts

/**
 * SolRouter Client Configuration
 *
 * Wraps the SolRouter SDK API key and network settings.
 * The SolRouter SDK (imported in lib/solRouter.ts) is already initialized
 * for server actions. This module provides the config object for the
 * new API route architecture.
 */

const solrouterApiKey = process.env.NEXT_PUBLIC_SOLROUTER_API_KEY;

if (!solrouterApiKey) {
  console.warn(
    '⚠️  NEXT_PUBLIC_SOLROUTER_API_KEY not set in .env.local\n' +
    '    SolRouter AI features will not function.\n' +
    '    Add: NEXT_PUBLIC_SOLROUTER_API_KEY=your_key_here'
  );
}

/**
 * SolRouter client configuration object
 */
export const solrouterConfig = {
  apiKey: solrouterApiKey || '',
  network: 'devnet' as const,
};

/**
 * Verify SolRouter is properly configured
 */
export function verifySolRouterConfig(): boolean {
  if (solrouterConfig.apiKey && solrouterConfig.network) {
    console.log('✅ SolRouter client configured successfully');
    return true;
  }
  console.error('❌ SolRouter configuration incomplete — check .env.local');
  return false;
}

export default solrouterConfig;
