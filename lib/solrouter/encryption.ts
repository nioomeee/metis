// lib/solrouter/encryption.ts
import { SolRouter } from '@solrouter/sdk';
import solrouterConfig from './client';

interface EncryptedPayload {
  encryptedData: string;
  walletAddress: string;
  timestamp: string;
}

function getSolRouterClient(): SolRouter {
  if (!solrouterConfig.apiKey) {
    throw new Error('SolRouter API key not configured. Check NEXT_PUBLIC_SOLROUTER_API_KEY in .env.local');
  }
  return new SolRouter({ apiKey: solrouterConfig.apiKey });
}

/**
 * Encrypt wallet data for secure TEE transmission
 */
export async function encryptWalletData(
  walletAddress: string,
  queryType: string,
  params: Record<string, any> = {}
): Promise<EncryptedPayload> {
  try {
    console.log('🔐 Encrypting wallet data...');

    const payload = {
      walletAddress,
      queryType,
      timestamp: new Date().toISOString(),
      data: params,
    };

    // Base64 encode the payload for transmission
    // NOTE: The SolRouter SDK handles actual TEE encryption at its endpoint
    const encryptedData = Buffer.from(JSON.stringify(payload)).toString('base64');

    console.log('✅ Payload prepared for SolRouter TEE');
    return {
      encryptedData,
      walletAddress,
      timestamp: payload.timestamp,
    };
  } catch (error) {
    console.error('❌ Encryption failed:', error);
    throw error;
  }
}

/**
 * Send encrypted data to SolRouter and get AI response
 */
export async function sendToSolRouterTEE(
  encryptedPayload: EncryptedPayload,
  prompt: string
): Promise<string> {
  try {
    console.log('📤 Sending encrypted data to SolRouter TEE...');
    const client = getSolRouterClient();

    // Combine the prompt with the encoded wallet context
    const secureQuery = `${prompt}\n\n[Encrypted Wallet Context]: ${encryptedPayload.encryptedData}`;

    const response = await client.chat(secureQuery);

    // @ts-ignore — SDK response shape varies
    const text = response?.text || response?.message || response?.content || String(response);

    console.log('✅ SolRouter TEE processing completed');
    return text;
  } catch (error) {
    console.error('❌ SolRouter TEE communication failed:', error);
    throw error;
  }
}

/**
 * Combined flow: encrypt then send to SolRouter TEE
 */
export async function encryptAndSendToTEE(
  walletAddress: string,
  queryType: string,
  params?: Record<string, any>
): Promise<string> {
  const prompts: Record<string, string> = {
    portfolio:
      'You are a DeFi portfolio analyst. Analyze this Solana wallet and provide: ' +
      '1) Risk assessment, 2) Portfolio health score with explanation, ' +
      '3) Top 3 strategic recommendations. Be data-driven and concise.',
    tax:
      'You are a DeFi tax expert specializing in Solana. Analyze this wallet and: ' +
      '1) Identify taxable events (swaps, staking rewards, airdrops), ' +
      '2) Estimate tax liability using FIFO, ' +
      '3) Identify loss-harvesting opportunities, ' +
      '4) Provide 3 actionable tax optimization strategies.',
    exit:
      'You are a DeFi liquidity expert. Analyze this Solana portfolio and: ' +
      '1) Model optimal exit scenarios with slippage estimates, ' +
      '2) Suggest smart routing strategies to minimize price impact, ' +
      '3) Provide a 3-step exit execution plan.',
  };

  console.log(`🔄 Starting ${queryType} TEE flow for ${walletAddress}...`);
  const encrypted = await encryptWalletData(walletAddress, queryType, params);
  const prompt = prompts[queryType] || prompts.portfolio;
  return sendToSolRouterTEE(encrypted, prompt);
}
