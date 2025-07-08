// src/components/ScopeSequenceSuggestion.tsx
import React, { useEffect, useState } from 'react';

interface Props {
  subject: string;
  grade: string;
}

export default function ScopeSequenceSuggestion({ subject, grade }: Props) {
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subject || !grade) return;
    setLoading(true);
    setError(null);
    fetch(`/api/scope-sequence?subject=${encodeURIComponent(subject)}&grade=${encodeURIComponent(grade)}`)
      .then(res => res.json())
      .then(data => {
        if (data.suggestions) {
          setSuggestions(data.suggestions);
        } else {
          setSuggestions(null);
          setError(data.error || 'No suggestions found.');
        }
      })
      .catch(() => setError('Failed to load suggestions.'))
      .finally(() => setLoading(false));
  }, [subject, grade]);

  if (!subject || !grade) return null;

  return (
    <div className="my-6 p-6 bg-white/90 rounded-2xl shadow border border-amber-100 min-w-0 break-words w-full max-w-full overflow-x-auto">
      <h4 className="text-lg font-bold text-amber-700 mb-4">Scope & Sequence Suggestions</h4>
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {suggestions && (
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          {suggestions.map((item, idx) => (
            <li key={idx} className="break-words whitespace-pre-line">{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

ScopeSequenceSuggestion.propTypes = {
  subject: require('prop-types').string.isRequired,
  grade: require('prop-types').string.isRequired,
};
