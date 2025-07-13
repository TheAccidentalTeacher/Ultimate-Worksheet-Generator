import React, { useState } from 'react';
import Image from 'next/image';
import { searchUnsplashImages } from '@/lib/api-services/unsplashService';
import type { UnsplashImage } from '@/lib/types';

interface UnsplashImageSelectorProps {
  onSelect: (url: string) => void;
  label?: string;
}

export default function UnsplashImageSelector({ onSelect, label }: UnsplashImageSelectorProps) {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setImages([]);
    try {
      const data = await searchUnsplashImages(query);
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
          placeholder={label || 'Search Unsplash for stock images (e.g. Abraham Lincoln, volcano, microscope...)'}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Search</button>
      </form>
      {loading && <div className="text-gray-500">Loading images...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
        {images.map(img => (
          <button
            key={img.id}
            type="button"
            className="border rounded-lg overflow-hidden hover:shadow-lg focus:ring-2 focus:ring-blue-400"
            onClick={() => onSelect(img.urls.small)}
            title={img.alt_description || 'Unsplash image'}
          >
            {/* Migrated to next/image for optimization */}
            <Image
              src={img.urls.small}
              alt={img.alt_description || 'Unsplash'}
              className="w-full h-32 object-cover"
              width={400}
              height={128}
              style={{ width: '100%', height: '8rem', objectFit: 'cover' }}
              unoptimized={img.urls.small.startsWith('data:')}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
