'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { listenForProgress } from '@/lib/progressService';
import UnsplashImageSelector from './UnsplashImageSelector';
import SubjectGradeSelector from './SubjectGradeSelector';
import ScopeSequenceSuggestion from './ScopeSequenceSuggestion';
import APIErrorHandler from './APIErrorHandler';
import { Send, Loader2, Download, Eye, Sparkles, BookOpen, Heart, Target, Clock, FileText } from 'lucide-react';
import { downloadAsPDF, downloadAsWord, WorksheetResult } from '@/lib/downloadUtils';

interface WorksheetProblem {
  id: number;
  type: string;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  christianConnection?: string;
  materials?: string;
}

interface WorksheetGeneratorProps {
  customization?: {
    grade: string;
    subject: string;
    topic: string;
    numProblems: number;
    scaffolding: string;
    differentiation: string;
    christianContent: number;
    worksheetStyle: string;
    timeEstimate: string;
  };
}


export default function WorksheetGenerator({ customization }: WorksheetGeneratorProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<WorksheetResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  // For scope & sequence suggestion
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');

  async function generateWorksheet(e?: React.FormEvent) {
    if (e) e.preventDefault();
    
    // Check if we have either a prompt or customization data
    if (!prompt.trim() && !customization) return;
    
    // If we have customization, ensure required fields are present
    if (customization && (!customization.grade || !customization.subject || !customization.topic)) {
      setError('Please fill in all required fields: grade, subject, and topic.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setProgress(0);

    try {
      // Use customization data if available, otherwise create from prompt
      const requestData = customization ? {
        grade: customization.grade,
        subject: customization.subject,
        topic: customization.topic || prompt.trim(), // fallback to prompt for topic
        worksheetStyle: customization.worksheetStyle || 'engaging',
        christianContent: customization.christianContent?.toString() || '1',
        scaffolding: customization.scaffolding || 'standard',
        differentiation: customization.differentiation || 'standard',
        timeEstimate: customization.timeEstimate || '30 minutes',
        numProblems: customization.numProblems || 5,
        // Enable visual generation for map-based content
        generateVisuals: true,
        includeImages: true,
        visualStyle: 'educational-maps'
      } : {
        // Legacy support for prompt-only requests
        prompt: prompt.trim(),
        grade: '5th', // default
        subject: 'General',
        topic: prompt.trim(),
        generateVisuals: true,
        includeImages: true
      };

      console.log('[WORKSHEET-GENERATOR] Sending request:', requestData);
      
      const res = await fetch('/api/generate-worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const errorMessage = errorData?.error || `HTTP ${res.status}: Failed to start worksheet generation`;
        console.error('[WORKSHEET-GENERATOR] API Error:', errorMessage, errorData);
        throw new Error(errorMessage);
      }
      const { jobId } = await res.json();
      
      // Add timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        setError('Generation is taking longer than expected. Please try again.');
        setLoading(false);
      }, 60000); // 60 seconds timeout
      
      const eventSource = listenForProgress(jobId, (progress) => {
        console.log('[WORKSHEET-GENERATOR] Progress update:', progress);
        setProgress(progress.percentage);
        if (progress.percentage === 100) {
          clearTimeout(timeout);
          if (progress.message.startsWith('Error')) {
            setError(progress.message);
            setLoading(false);
          } else {
            // Add a small delay to ensure backend has finished processing
            setTimeout(() => {
              fetch(`/api/generate-worksheet?jobId=${encodeURIComponent(jobId)}`)
                .then(r => {
                  if (!r.ok) {
                    throw new Error(`HTTP ${r.status}: Failed to retrieve worksheet`);
                  }
                  return r.json();
                })
                .then(data => {
                  console.log('[WORKSHEET-GENERATOR] Retrieved worksheet:', data);
                  if (data.worksheet) {
                    setResult(data.worksheet);
                    setLoading(false);
                  } else {
                    throw new Error('No worksheet data received');
                  }
                })
                .catch(err => {
                  console.error('Failed to fetch worksheet result:', err);
                  setError('Failed to retrieve worksheet. Please try again.');
                  setLoading(false);
                });
            }, 1000); // 1 second delay
          }
        }
      });
      
      // Cleanup on unmount
      return () => {
        clearTimeout(timeout);
        if (eventSource) {
          eventSource.close();
        }
      };
    } catch (err: any) {
      setError('Sorry, something went wrong while generating your worksheet. Please try again, check your internet connection, or contact support if the problem continues.');
      setLoading(false);
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice': return '📝';
      case 'fill-in-blank': return '✏️';
      case 'short-answer': return '💭';
      case 'word-problem': return '🧮';
      case 'matching': return '🔗';
      case 'true-false': return '✅';
      case 'coloring-page': return '🎨';
      case 'drawing-prompt': return '✏️';
      case 'art-technique': return '🖌️';
      case 'creative-project': return '🎭';
      case 'rhythm-practice': return '🥁';
      case 'note-identification': return '🎵';
      case 'listening-activity': return '👂';
      case 'singing-exercise': return '🎤';
      case 'exercise-routine': return '🏃';
      case 'movement-game': return '🤸';
      case 'fitness-challenge': return '💪';
      case 'experiment': return '🔬';
      case 'observation': return '🔍';
      case 'diagram-labeling': return '📊';
      case 'reading-comprehension': return '📖';
      case 'creative-writing': return '✍️';
      case 'grammar-practice': return '📝';
      case 'vocabulary': return '📚';
      case 'poetry': return '🎭';
      default: return '📋';
    }
  };


  return (
    <div className="w-full space-y-6 min-w-0 max-w-full">
      {/* Subject/Grade selection and scope & sequence suggestion */}
      {!customization && (
        <>
          <SubjectGradeSelector
            subject={subject}
            setSubject={setSubject}
            grade={grade}
            setGrade={setGrade}
            subjects={["Math", "Reading", "Science"]}
            grades={["K", "1", "2", "3"]}
          />
          {subject && grade && (
            <ScopeSequenceSuggestion subject={subject} grade={grade} />
          )}
          <form onSubmit={generateWorksheet} className="space-y-4">
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Describe your worksheet
              </label>
              <textarea
                className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all resize-none break-words min-w-0 max-w-full"
                rows={3}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Example: Create a 3rd grade math worksheet on multiplication with biblical themes..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Worksheet</span>
                  <Send className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </>
      )}

      {/* Generate button for dashboard customization */}
      {customization && (
        <div className="space-y-4">
          <button
            onClick={() => generateWorksheet()}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-6 rounded-2xl font-bold text-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
          >
            {loading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Creating Your Magical Worksheet...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-6 w-6" />
                <span>Create My Magical Worksheet!</span>
                <BookOpen className="h-6 w-6" />
              </>
            )}
          </button>
          
          {/* Progress Bar */}
          {loading && (
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          
          {loading && (
            <div className="text-center text-gray-600 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>
                  {progress < 30 ? 'Gathering inspiration...' :
                   progress < 60 ? 'Crafting your perfect worksheet...' :
                   progress < 90 ? 'Adding finishing touches...' :
                   'Almost ready!'}
                </span>
              </div>
              {/* Debug button for stuck states */}
              {progress === 0 && (
                <button
                  onClick={() => {
                    setError('Generation appears stuck. Please try again with a fresh request.');
                    setLoading(false);
                    setProgress(0);
                  }}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Cancel and try again
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="space-y-4">
          <APIErrorHandler 
            error={error} 
            service={error.includes('API key') ? 'openai' : 'general'} 
            onRetry={() => generateWorksheet()}
          />
          {/* Manual refresh button for stuck loading states */}
          <button
            onClick={() => {
              setError('');
              setLoading(false);
              setProgress(0);
              // Try to retrieve any recent worksheets
              const recentJobIds = ['ws-1752428924934-t9t6a0cf', 'ws-1752428542533-h9r4heje'];
              const tryRetrieveRecent = async () => {
                for (const jobId of recentJobIds) {
                  try {
                    const response = await fetch(`/api/generate-worksheet?jobId=${jobId}`);
                    if (response.ok) {
                      const data = await response.json();
                      if (data.worksheet) {
                        setResult(data.worksheet);
                        return;
                      }
                    }
                  } catch (error) {
                    console.log(`Failed to retrieve ${jobId}:`, error);
                  }
                }
              };
              tryRetrieveRecent();
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Reset and Try Again (or Retrieve Recent)
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg animate-fade-in min-w-0 max-w-full">
          {/* Unsplash Image Selector for higher-level/stock images */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              Add a Stock Image (Unsplash)
              <span className="text-xs text-gray-400" title="Use a real-world photo for history, science, ELA, or when a stock image is better than a generated one.">(info)</span>
            </h4>
            <UnsplashImageSelector onSelect={setSelectedImage} />
            {selectedImage && (
              <div className="mt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {/* Migrated to next/image for optimization */}
                <Image
                  src={selectedImage}
                  alt="Selected Unsplash"
                  className="w-full max-h-64 object-contain rounded-xl border"
                  width={800}
                  height={400}
                  style={{ width: '100%', height: 'auto', maxHeight: '16rem', objectFit: 'contain', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}
                  unoptimized={selectedImage.startsWith('data:')}
                />
                <div className="text-xs text-gray-500 mt-1">This image will be included as a stock photo for your worksheet.</div>
              </div>
            )}
          </div>
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-100 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{result.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      {result.grade} {result.subject}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {result.estimatedTime}
                    </span>
                    <span className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {(() => {
                        const problemCount = (result.problems && Array.isArray(result.problems)) ? result.problems.length : 0;
                        return problemCount === 1 ? '1 item' : `${problemCount} items`;
                      })()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => window.print()}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition-colors flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </button>
                <button 
                  onClick={() => result && downloadAsPDF(result)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            
            {result.error && (
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> {result.error}
                </p>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 min-w-0 max-w-full">
            {/* Description & Instructions */}
            <div className="mb-6 space-y-4 min-w-0 max-w-full">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-3 break-words whitespace-pre-line">{result.description}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Student Instructions</h4>
                <p className="text-gray-700 bg-blue-50 rounded-lg p-3 break-words whitespace-pre-line">{result.instructions}</p>
              </div>
            </div>

            {/* Visual Elements & Images */}
            {(result.images || result.visualElements) && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Visual Elements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.images && result.images.map((img, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={img.url}
                        alt={img.alt || img.description}
                        className="w-full h-48 object-cover"
                        width={400}
                        height={200}
                      />
                      <div className="p-3">
                        <p className="text-sm text-gray-600">{img.description}</p>
                      </div>
                    </div>
                  ))}
                  {result.visualElements && result.visualElements.map((visual, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={visual.url}
                        alt={visual.description}
                        className="w-full h-48 object-cover"
                        width={400}
                        height={200}
                      />
                      <div className="p-3">
                        <p className="text-sm text-gray-600 font-medium">{visual.type}</p>
                        <p className="text-sm text-gray-500">{visual.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Problems */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {(() => {
                  const problemCount = (result.problems && Array.isArray(result.problems)) ? result.problems.length : 0;
                  return problemCount === 1 ? 'Activity' : 'Problems & Activities';
                })()}
              </h4>
              <div className="space-y-4 min-w-0 max-w-full">
                {(result.problems && Array.isArray(result.problems) ? result.problems : []).map((problem, index) => (
                  <div key={problem.id || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <div className="bg-amber-100 text-amber-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">{getTypeIcon(problem.type)}</span>
                          <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full font-medium">
                            {problem.type.replace('-', ' ').toUpperCase()}
                          </span>
                          {problem.christianConnection && (
                            <Heart className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <p className="text-gray-900 font-medium mb-2 break-words whitespace-pre-line">{problem.question}</p>
                        
                        {problem.options && (
                          <div className="mb-2 space-y-1 min-w-0 max-w-full">
                            {problem.options.map((option, i) => (
                              <div key={i} className="text-sm text-gray-600 pl-4 break-words whitespace-pre-line">{option}</div>
                            ))}
                          </div>
                        )}
                        
                        <div className="space-y-2 text-sm">
                          <p className="text-green-700 break-words whitespace-pre-line">
                            <strong>Answer:</strong> {problem.answer}
                          </p>
                          <p className="text-gray-600 break-words whitespace-pre-line">
                            <strong>Explanation:</strong> {problem.explanation}
                          </p>
                          {problem.christianConnection && (
                            <p className="text-purple-700 break-words whitespace-pre-line">
                              <strong>Faith Connection:</strong> {problem.christianConnection}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Materials */}
              {result.materials && result.materials.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Materials Needed</h4>
                  <ul className="space-y-2 pl-4 break-words">
                    {result.materials.map((material, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="text-amber-600 mr-2">•</span>
                        {material}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Extensions */}
              {result.extensions && result.extensions.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Extension Activities</h4>
                  <ul className="space-y-2 pl-4 break-words">
                    {result.extensions.map((extension, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="text-amber-600 mr-2">✨</span>
                        {extension}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Teacher Notes */}
            {result.answerKey && (
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Teacher Notes</h4>
                {typeof result.answerKey === 'string' ? (
                  <p className="text-gray-700 break-words whitespace-pre-line">{result.answerKey}</p>
                ) : (
                  <div className="space-y-3">
                    {result.answerKey.solutions && (
                      <div>
                        <h5 className="font-semibold text-gray-800">Solutions:</h5>
                        <p className="text-gray-700 break-words whitespace-pre-line">{result.answerKey.solutions}</p>
                      </div>
                    )}
                    {result.answerKey.teachingTips && (
                      <div>
                        <h5 className="font-semibold text-gray-800">Teaching Tips:</h5>
                        <p className="text-gray-700 break-words whitespace-pre-line">{result.answerKey.teachingTips}</p>
                      </div>
                    )}
                    {result.answerKey.commonMistakes && (
                      <div>
                        <h5 className="font-semibold text-gray-800">Common Mistakes:</h5>
                        <p className="text-gray-700 break-words whitespace-pre-line">{result.answerKey.commonMistakes}</p>
                      </div>
                    )}
                    {result.answerKey.extensionActivities && (
                      <div>
                        <h5 className="font-semibold text-gray-800">Extension Activities:</h5>
                        <p className="text-gray-700 break-words whitespace-pre-line">{result.answerKey.extensionActivities}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button 
                onClick={() => result && downloadAsPDF(result)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
              <button 
                onClick={() => result && downloadAsWord(result)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download DOCX</span>
              </button>
              <button 
                onClick={() => generateWorksheet()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create Answer Key
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                Save to Library
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

WorksheetGenerator.propTypes = {
  customization: require('prop-types').shape({
    grade: require('prop-types').string,
    subject: require('prop-types').string,
    topic: require('prop-types').string,
    numProblems: require('prop-types').number,
    scaffolding: require('prop-types').string,
    differentiation: require('prop-types').string,
    christianContent: require('prop-types').number,
    worksheetStyle: require('prop-types').string,
    timeEstimate: require('prop-types').string,
  }),
};
