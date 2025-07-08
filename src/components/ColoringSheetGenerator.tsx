'use client';

import React, { useState } from 'react';
import { Loader2, Download, Eye, Sparkles, Heart, Palette } from 'lucide-react';
import { downloadColoringSheetAsPDF, generateColoringSheetData, ColoringSheetResult } from '@/lib/coloringSheetUtils';
import { generateColoringImage } from '@/lib/coloringImageApi';

interface ColoringSheetGeneratorProps {
  theme: string;
  ageGroup: string; 
  faithLevel: number;
}

export default function ColoringSheetGenerator({ theme, ageGroup, faithLevel }: ColoringSheetGeneratorProps) {
  const [result, setResult] = useState<ColoringSheetResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState<string[]>([]); // URLs of generated images

  async function generateColoringSheet() {
    setLoading(true);
    setProgress(0);
    setResult(null);
    setImages([]);

    // Progress simulation for a nice UX
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      // Simulate some processing time for the whimsical effect
      await new Promise(resolve => setTimeout(resolve, 1000));

      const coloringSheet = generateColoringSheetData(theme, ageGroup, faithLevel.toString());
      setResult(coloringSheet);

      // For each coloring page, generate an image
      const imageUrls: string[] = [];
      for (const page of coloringSheet.coloringPages) {
        // Use the page description as the prompt
        const prompt = `${page.title}: ${page.description}`;
        const imageUrl = await generateColoringImage(prompt);
        imageUrls.push(imageUrl || '');
        setProgress(p => Math.min(95, p + 5));
      }
      setImages(imageUrls);

      setProgress(100);
      setTimeout(() => {
        clearInterval(progressInterval);
      }, 500);
    } catch (error) {
      console.error('Error generating coloring sheet:', error);
      clearInterval(progressInterval);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 600);
    }
  }

  const handleDownloadPDF = () => {
    if (result) {
      downloadColoringSheetAsPDF(result);
    }
  };

  React.useEffect(() => {
    if (theme && ageGroup) {
      generateColoringSheet();
    }
  }, [theme, ageGroup, faithLevel]);

  return (
    <div className="space-y-6">
      {loading && (
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-2xl p-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Palette className="h-12 w-12 text-pink-500 animate-spin" />
                <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Creating Your Magical Coloring Sheet!</h3>
            <p className="text-gray-600 mb-4">Sprinkling creativity and adding whimsical touches... ✨</p>
            
            {/* Progress Bar */}
            <div className="bg-white rounded-full h-4 shadow-inner mb-4">
              <div 
                className="bg-gradient-to-r from-pink-400 to-purple-400 h-4 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {progress < 30 && "🎨 Choosing the perfect colors..."}
              {progress >= 30 && progress < 60 && "✨ Adding magical details..."}
              {progress >= 60 && progress < 90 && "🌈 Bringing everything to life..."}
              {progress >= 90 && "🎉 Almost ready for coloring!"}
            </div>
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Palette className="h-6 w-6" />
                  <h2 className="text-2xl font-bold">Your Coloring Sheet is Ready!</h2>
                  <Sparkles className="h-6 w-6" />
                </div>
                <p className="opacity-90">{result.title} - {result.description}</p>
              </div>
            </div>
          </div>

          {/* Content Preview */}
          <div className="p-8">
            <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🎨</span>
                What's Inside Your Coloring Book
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/80 rounded-xl p-4 border border-pink-200">
                  <h4 className="font-semibold text-purple-800 mb-2">📖 Theme & Details</h4>
                  <p className="text-sm text-gray-700 mb-1"><strong>Theme:</strong> {result.theme}</p>
                  <p className="text-sm text-gray-700 mb-1"><strong>Age Group:</strong> {result.ageGroup}</p>
                  <p className="text-sm text-gray-700"><strong>Faith Level:</strong> {result.faithLevel}</p>
                </div>
                
                <div className="bg-white/80 rounded-xl p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">🎯 What You'll Get</h4>
                  <p className="text-sm text-gray-700 mb-1">• {result.coloringPages.length} beautiful coloring pages</p>
                  <p className="text-sm text-gray-700 mb-1">• Detailed coloring instructions</p>
                  <p className="text-sm text-gray-700">• Fun activities and tips</p>
                </div>
              </div>

              {/* Pages Preview */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <span className="text-lg mr-2">🌟</span>
                  Coloring Pages Preview
                </h4>
                <div className="grid gap-4">
                  {result.coloringPages.map((page, index) => (
                    <div key={page.id} className="bg-white/90 rounded-xl p-4 border border-gray-200 flex flex-col items-center">
                      <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-full w-10 h-10 flex items-center justify-center font-bold text-purple-700 mb-2">
                        {page.id}
                      </div>
                      <h5 className="font-semibold text-gray-800 mb-1">{page.title}</h5>
                      <p className="text-sm text-gray-600 mb-2">{page.description}</p>
                      {/* Show generated image */}
                      {images[index] ? (
                        <img src={images[index]} alt={page.title} className="w-full max-w-xs border-2 border-dashed border-pink-300 rounded-lg bg-white my-2" style={{background: '#fff'}} />
                      ) : (
                        <div className="w-full h-64 flex items-center justify-center text-gray-400 italic">Image loading...</div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {page.elements.slice(0, 3).map((element, i) => (
                          <span key={i} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                            {element}
                          </span>
                        ))}
                        {page.elements.length > 3 && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                            +{page.elements.length - 3} more
                          </span>
                        )}
                      </div>
                      {page.christianConnection && (
                        <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
                          <p className="text-xs text-blue-700 flex items-center">
                            <Heart className="h-3 w-3 mr-1" />
                            {page.christianConnection}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Activities Preview */}
              {result.activities && (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="text-lg mr-2">🎭</span>
                    Bonus Activities
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {result.activities.slice(0, 3).map((activity, i) => (
                      <li key={i} className="flex items-center">
                        <span className="text-yellow-500 mr-2">⭐</span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Download Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-4 rounded-2xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
              >
                <Download className="h-6 w-6" />
                <span>Download PDF Coloring Book</span>
                <span className="text-2xl">🎨</span>
              </button>
              
              <button
                onClick={() => window.open('', '_blank')}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-4 rounded-2xl font-semibold transition-all flex items-center justify-center space-x-3"
              >
                <Eye className="h-5 w-5" />
                <span>Preview First</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
