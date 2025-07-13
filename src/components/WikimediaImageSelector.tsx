import React, { useState } from 'react';
import Image from 'next/image';
import { searchWikimediaImages } from '@/lib/api-services/wikimediaService';
import type { WikimediaImage } from '@/lib/types';

interface WikimediaImageSelectorProps {
  onSelect: (url: string) => void;
  label?: string;
}

export default function WikimediaImageSelector({ onSelect, label }: WikimediaImageSelectorProps) {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState<WikimediaImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setImages([]);
    try {
      const data = await searchWikimediaImages(query);
      setImages(data || []);
    } catch (err: any) {
      setError('Failed to fetch images.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-6">
      <form onSubmit={handleSearch} className="flex gap-2 mb-2">
        <input
          type="text"
          className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
          placeholder={label || 'Search Wikimedia Commons (e.g. George Washington, Saturn, microscope...)'}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">Search</button>
      </form>
      {loading && <div className="text-gray-500">Loading images...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
        {images.map(img => (
          <button
            key={img.id}
            type="button"
            className="border rounded-lg overflow-hidden hover:shadow-lg focus:ring-2 focus:ring-green-400"
            onClick={() => onSelect(img.url)}
            title={img.title}
          >
            {/* Migrated to next/image for optimization */}
            <Image
              src={img.thumbUrl || img.url}
              alt={img.title}
              className="w-full h-32 object-cover"
              width={400}
              height={128}
              style={{ width: '100%', height: '8rem', objectFit: 'cover' }}
              unoptimized={(img.thumbUrl || img.url).startsWith('data:')}
            />
            <div className="text-xs text-gray-700 p-1 bg-white/80 truncate">{img.license || ''}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
