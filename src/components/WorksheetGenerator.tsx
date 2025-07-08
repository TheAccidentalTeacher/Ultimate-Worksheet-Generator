'use client';

import React, { useState } from 'react';

export default function WorksheetGenerator() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generateWorksheet(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/generate-advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error('Failed to generate worksheet');
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form className="mb-6" onSubmit={generateWorksheet}>
        <label className="block text-lg font-bold mb-2 text-primary-700">
          Describe your worksheet (grade, subject, topic, etc.):
        </label>
        <textarea
          className="w-full border rounded p-3 mb-2 min-h-[80px]"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="e.g. 3rd grade science worksheet about frogs, faith integrated, include coloring page"
          required
        />
        <button
          type="submit"
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded font-bold"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Worksheet'}
        </button>
      </form>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {result && (
        <div className="bg-primary-50 border rounded p-4">
          <h3 className="font-bold text-xl mb-2 text-primary-700">Result:</h3>
          <pre className="whitespace-pre-wrap break-all text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
