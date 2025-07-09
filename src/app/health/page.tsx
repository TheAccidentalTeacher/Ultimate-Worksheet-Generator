'use client';

import { useState, useEffect } from 'react';

export default function HealthCheck() {
  const [envStatus, setEnvStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/debug-env')
      .then(res => res.json())
      .then(data => {
        setEnvStatus(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Health check failed:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-4">Checking system status...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">System Health Check</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        {envStatus && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>OpenAI API Key:</span>
              <span className={envStatus.OPENAI_API_KEY.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                {envStatus.OPENAI_API_KEY}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Pixabay API Key:</span>
              <span className={envStatus.PIXABAY_API_KEY?.includes('✅') ? 'text-green-600' : 'text-orange-500'}>
                {envStatus.PIXABAY_API_KEY} (Optional)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Environment:</span>
              <span>{envStatus.NODE_ENV}</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Setup Instructions</h3>
        <ol className="list-decimal list-inside space-y-1 text-blue-700 text-sm">
          <li>Get an OpenAI API key from <a href="https://platform.openai.com/api-keys" className="underline" target="_blank" rel="noopener noreferrer">platform.openai.com</a></li>
          <li>Add it to your <code>.env.local</code> file as <code>OPENAI_API_KEY=your-key-here</code></li>
          <li>Restart your development server</li>
          <li>Optional: Add image service API keys for enhanced features</li>
        </ol>
      </div>
    </div>
  );
}
