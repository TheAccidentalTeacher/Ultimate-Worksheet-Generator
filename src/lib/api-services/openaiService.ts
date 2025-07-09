import OpenAI from 'openai';

// Check for API key
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('[OPENAI] OPENAI_API_KEY environment variable is not set');
  // Don't throw in build time, allow runtime handling
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    console.warn('[OPENAI] OpenAI service will not work without API key');
  }
}

export const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key-for-build',
});

console.log('[OPENAI] OpenAI service initialized with API key:', apiKey ? `${apiKey.substring(0, 7)}...` : 'NOT SET');
