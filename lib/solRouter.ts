'use server';

import { SolRouter } from '@solrouter/sdk';

const apiKey = process.env.NEXT_PUBLIC_SOLROUTER_API_KEY || '';

const client = new SolRouter({ apiKey });

export async function encryptAndAnalyze(walletData: any, prompt: string) {
  try {
    const secureQuery = `Prompt: ${prompt}\n\nWallet Data:\n${JSON.stringify(walletData, null, 2)}`;
    
    const response = await client.chat(secureQuery);
    // @ts-ignore
    return response?.text || response?.message || response?.content || response || "Analysis complete.";
  } catch (error) {
    console.error('Error in encryptAndAnalyze:', error);
    throw error;
  }
}
