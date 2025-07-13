// Client helper for fetching API keys from Netlify Functions
// Use this in other apps to get API keys securely

export interface ApiKeys {
  openai?: string;
  stability?: string;
  replicate?: string;
  unsplash?: string;
  pexels?: string;
  pixabay?: string;
  azure_foundry?: string;
  azure_endpoint?: string;
}

export async function getApiKeys(
  appName: string = 'worksheet-generator',
  requestedKeys?: string[]
): Promise<ApiKeys> {
  const SHARED_SECRET = process.env.SHARED_SECRET || 'your-secure-shared-secret-here';
  const API_ENDPOINT = process.env.API_KEY_SERVICE_URL || 'https://your-keys-site.netlify.app/.netlify/functions/get-api-keys';

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appName,
        sharedSecret: SHARED_SECRET,
        requestedKeys
      })
    });

    if (!response.ok) {
      throw new Error(`API key service error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Failed to retrieve API keys');
    }

    return data.keys;

  } catch (error) {
    console.error('Error fetching API keys:', error);
    // Fallback to local environment variables
    return {
      openai: process.env.OPENAI_API_KEY,
      stability: process.env.STABILITY_AI_API_KEY,
      replicate: process.env.REPLICATE_API_TOKEN,
      unsplash: process.env.UNSPLASH_ACCESS_KEY,
      pexels: process.env.PEXELS_API_KEY,
      pixabay: process.env.PIXABAY_API_KEY,
      azure_foundry: process.env.AZURE_AI_FOUNDRY_KEY,
      azure_endpoint: process.env.AZURE_AI_FOUNDRY_ENDPOINT,
    };
  }
}

// Example usage:
// const keys = await getApiKeys('my-app', ['openai', 'stability']);
// const openai = new OpenAI({ apiKey: keys.openai });
