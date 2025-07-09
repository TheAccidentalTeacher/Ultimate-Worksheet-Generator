'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Loader2, Download, Eye, Sparkles, Heart, Palette } from 'lucide-react';
import { downloadColoringSheetAsPDF, generateColoringSheetData, ColoringSheetResult } from '@/lib/coloringSheetUtils';
import { generateColoringImage } from '@/lib/coloringImageApi';
import type { ColoringSheetPage } from '@/lib/types';

interface ColoringSheetGeneratorProps {
  theme: string;
  ageGroup: string; 
  faithLevel: number;
}

export default function ColoringSheetGenerator({ theme, ageGroup, faithLevel }: ColoringSheetGeneratorProps) {
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ColoringSheetResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState<string[]>([]); // URLs of generated images
  const [prompts, setPrompts] = useState<string[]>([]); // Prompts for each page
  const [editingPromptIdx, setEditingPromptIdx] = useState<number | null>(null);
  const [promptEdits, setPromptEdits] = useState<{[idx: number]: string}>({});
  // Prompt recorder state
  const [promptHistory, setPromptHistory] = useState<Array<{
    timestamp: string;
    prompt: string;
    model: string;
    type: 'worksheet' | 'image';
    pageIndex?: number;
  }>>([]);
  const [showPromptHistory, setShowPromptHistory] = useState(false);

  // Build default prompt for a page
  const buildPrompt = (page: ColoringSheetPage) => `${page.title}: ${page.description}`;

  const generateColoringSheet = React.useCallback(async function() {
    setLoading(true);
    setError(null);
    setProgress(0);
    setResult(null);
    setImages([]);
    setPrompts([]);
    setEditingPromptIdx(null);
    setPromptEdits({});

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

      // Record worksheet (GPT) prompt
      const worksheetPrompt = `Theme: ${theme}, Age Group: ${ageGroup}, Faith Level: ${faithLevel}`;
      setPromptHistory(h => [
        ...h,
        {
          timestamp: new Date().toLocaleString(),
          prompt: worksheetPrompt,
          model: 'generateColoringSheetData (local/gpt)',
          type: 'worksheet',
        },
      ]);

      const coloringSheet = generateColoringSheetData(theme, ageGroup, faithLevel.toString());
      setResult(coloringSheet);

      // For each coloring page, let parent edit prompt, then generate an image
      const defaultPrompts = coloringSheet.coloringPages.map(buildPrompt);
      setPrompts(defaultPrompts);
      // Only auto-generate if not in edit mode
      const imageUrls: string[] = [];
      for (let i = 0; i < coloringSheet.coloringPages.length; i++) {
        const prompt = defaultPrompts[i];
        // Record image prompt
        setPromptHistory(h => [
          ...h,
          {
            timestamp: new Date().toLocaleString(),
            prompt,
            model: 'Replicate SDXL (line art)',
            type: 'image',
            pageIndex: i,
          },
        ]);
        let imageUrl = null;
        try {
          // Always prefer DALL-E for coloring books to get actual line art
          imageUrl = await generateColoringImage(prompt, true);
        } catch (err: any) {
          console.log('[COLORING] Image generation failed, trying fallback:', err.message);
          // Continue without failing the whole process
        }
        if (!imageUrl) {
          // Fallback: use a placeholder or skip image generation
          try {
            const res = await fetch(`/api/unsplash?query=${encodeURIComponent(prompt)}`);
            if (res.ok) {
              const data = await res.json();
              imageUrl = data.results?.[0]?.urls?.regular || '';
            }
          } catch (fallbackErr) {
            console.log('[COLORING] Unsplash fallback also failed, using placeholder');
            // Use a placeholder image or empty string
            imageUrl = '';
          }
        }
        imageUrls.push(imageUrl || '');
        setProgress(p => Math.min(95, p + 5));
      }
      setImages(imageUrls);

      setProgress(100);
      setTimeout(() => {
        clearInterval(progressInterval);
      }, 500);
    } catch (error: any) {
      console.error('[COLORING] Error generating coloring sheet:', error);
      setError('Sorry, something went wrong while generating your coloring sheet. The basic structure was created, but images may be missing.');
      clearInterval(progressInterval);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 600);
    }
  }, [theme, ageGroup, faithLevel]);

  const handleDownloadPDF = () => {
    if (result) {
      downloadColoringSheetAsPDF(result, images);
    }
  };

  // Allow parent to edit prompt for a page
  const handleEditPrompt = (idx: number) => {
    setEditingPromptIdx(idx);
    setPromptEdits(edits => ({ ...edits, [idx]: prompts[idx] }));
  };
  const handlePromptChange = (idx: number, value: string) => {
    setPromptEdits(edits => ({ ...edits, [idx]: value }));
  };
  const handleSavePrompt = async (idx: number) => {
    const newPrompt = promptEdits[idx];
    setPrompts(p => p.map((old, i) => (i === idx ? newPrompt : old)));
    setEditingPromptIdx(null);
    // Record image prompt
    setPromptHistory(h => [
      ...h,
      {
        timestamp: new Date().toLocaleString(),
        prompt: newPrompt,
        model: 'Replicate SDXL (line art)',
        type: 'image',
        pageIndex: idx,
      },
    ]);
    // Regenerate image for this page
    const imageUrl = await generateColoringImage(newPrompt, true);
    setImages(imgs => imgs.map((old, i) => (i === idx ? (imageUrl || '') : old)));
  };

  React.useEffect(() => {
    if (theme && ageGroup) {
      generateColoringSheet();
    }
  }, [theme, ageGroup, faithLevel, generateColoringSheet]);

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">⚠️</div>
            <div className="text-red-800 font-medium">{error}</div>
          </div>
        </div>
      )}
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

      {/* Prompt Recorder Panel */}
      <div className="mb-4 min-w-0 max-w-full">
        <button
          className="text-xs text-blue-700 underline mb-2"
          onClick={() => setShowPromptHistory(v => !v)}
        >
          {showPromptHistory ? 'Hide' : 'Show'} Prompt Recorder
        </button>
        {showPromptHistory && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-h-64 overflow-y-auto text-xs min-w-0 max-w-full break-words">
            <div className="font-bold mb-2 text-blue-900">Prompt Recorder</div>
            <ul className="space-y-1 pl-4">
              {promptHistory.map((entry, i) => (
                <li key={i} className="border-b border-blue-100 pb-1 mb-1">
                  <span className="text-blue-800">[{entry.timestamp}]</span> <span className="font-semibold">{entry.type === 'worksheet' ? 'Worksheet' : 'Image'} Prompt</span> <span className="text-gray-600">({entry.model}{entry.pageIndex !== undefined ? `, Page ${entry.pageIndex + 1}` : ''})</span><br />
                  <span className="text-gray-800 break-words whitespace-pre-line">{entry.prompt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {result && !loading && (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-200 overflow-hidden min-w-0 max-w-full">
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
          <div className="p-8 min-w-0 max-w-full">
            <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-2xl p-6 mb-6 min-w-0 max-w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🎨</span>
                What&apos;s Inside Your Coloring Book
              </h3>
              
                <div className="grid md:grid-cols-2 gap-4 mb-6 min-w-0 max-w-full">
                <div className="bg-white/80 rounded-xl p-4 border border-pink-200">
                  <h4 className="font-semibold text-purple-800 mb-2">📖 Theme & Details</h4>
                  <p className="text-sm text-gray-700 mb-1"><strong>Theme:</strong> {result.theme}</p>
                  <p className="text-sm text-gray-700 mb-1"><strong>Age Group:</strong> {result.ageGroup}</p>
                  <p className="text-sm text-gray-700"><strong>Faith Level:</strong> {result.faithLevel}</p>
                </div>
                
                <div className="bg-white/80 rounded-xl p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">🎯 What You&apos;ll Get</h4>
                  <p className="text-sm text-gray-700 mb-1">• {result.coloringPages.length} beautiful coloring pages</p>
                  <p className="text-sm text-gray-700 mb-1">• Detailed coloring instructions</p>
                  <p className="text-sm text-gray-700">• Fun activities and tips</p>
                </div>
              </div>

              {/* Pages Preview */}
                <div className="space-y-4 min-w-0 max-w-full">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <span className="text-lg mr-2">🌟</span>
                  Coloring Pages Preview
                </h4>
                <div className="grid gap-4">
                  {result.coloringPages.map((page, index) => (
                    <div key={page.id} className="bg-white/90 rounded-xl p-4 border border-gray-200 flex flex-col items-center min-w-0 max-w-full">
                      <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-full w-10 h-10 flex items-center justify-center font-bold text-purple-700 mb-2">
                        {page.id}
                      </div>
                      <h5 className="font-semibold text-gray-800 mb-1">{page.title}</h5>
                      <p className="text-sm text-gray-600 mb-2">{page.description}</p>
                      {/* Prompt editor */}
                      {editingPromptIdx === index ? (
                        <div className="w-full flex flex-col items-center mb-2">
                          <textarea
                            className="w-full max-w-xs border border-pink-300 rounded-lg p-2 text-sm mb-2"
                            value={promptEdits[index]}
                            onChange={e => handlePromptChange(index, e.target.value)}
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button onClick={() => handleSavePrompt(index)} className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">Save & Regenerate</button>
                            <button onClick={() => setEditingPromptIdx(null)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full flex flex-col items-center mb-2">
                          <div className="text-xs text-gray-500 mb-1">Prompt used for image:</div>
                          <div className="bg-gray-50 border border-dashed border-pink-200 rounded p-2 text-xs w-full max-w-xs mb-1 break-words whitespace-pre-line">{prompts[index]}</div>
                          <button onClick={() => handleEditPrompt(index)} className="text-pink-600 text-xs underline">Edit prompt & regenerate</button>
                        </div>
                      )}
                      {/* Show generated image */}
                      {images[index] ? (
                        /* Migrated to next/image for optimization */
                        <Image
                          src={images[index]}
                          alt={page.title}
                          className="w-full max-w-xs border-2 border-dashed border-pink-300 rounded-lg bg-white my-2"
                          width={400}
                          height={400}
                          style={{ background: '#fff', width: '100%', maxWidth: '20rem', border: '2px dashed #f472b6', borderRadius: '0.5rem', margin: '0.5rem 0' }}
                          unoptimized={images[index]?.startsWith('data:')}
                        />
                      ) : (
                        <div className="w-full max-w-xs h-64 flex flex-col items-center justify-center text-gray-400 italic bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg my-2">
                          <div className="text-6xl mb-2">🎨</div>
                          <div className="text-center px-4">
                            <p className="text-sm">Image generation unavailable</p>
                            <p className="text-xs text-gray-500 mt-1">The coloring page structure is ready for you to print and color!</p>
                          </div>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2 min-w-0 max-w-full">
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
                        <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2 min-w-0 max-w-full">
                          <p className="text-xs text-blue-700 flex items-center break-words whitespace-pre-line">
                            <Heart className="h-3 w-3 mr-1" />
                            {page.christianConnection}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
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

ColoringSheetGenerator.propTypes = {
  theme: require('prop-types').string.isRequired,
  ageGroup: require('prop-types').string.isRequired,
  faithLevel: require('prop-types').number.isRequired,
};
