import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.error('[OPENAI] OPENAI_API_KEY environment variable is not set');
  throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log('[OPENAI] OpenAI service initialized with API key:', process.env.OPENAI_API_KEY?.substring(0, 20) + '...');
