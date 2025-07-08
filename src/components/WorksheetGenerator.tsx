'use client';

import React, { useState } from 'react';
import { Send, Loader2, Download, Eye, Sparkles, BookOpen, Heart, Target, Clock, FileText } from 'lucide-react';

interface WorksheetProblem {
  id: number;
  type: string;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  christianConnection?: string;
}

interface WorksheetResult {
  title: string;
  grade: string;
  subject: string;
  topic: string;
  description: string;
  instructions: string;
  estimatedTime: string;
  problems: WorksheetProblem[];
  answerKey: string;
  extensions?: string[];
  materials?: string[];
  error?: string;
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
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<WorksheetResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generateWorksheet(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() && !customization) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const requestData = {
        prompt,
        ...customization
      };

      const res = await fetch('/api/generate-advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      
      if (!res.ok) throw new Error('Failed to generate worksheet');
      
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating your worksheet');
    } finally {
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
      default: return '📋';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Simple prompt input for custom requests */}
      {!customization && (
        <form onSubmit={generateWorksheet} className="space-y-4">
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Describe your worksheet
            </label>
            <textarea
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all resize-none"
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
      )}

      {/* Generate button for dashboard customization */}
      {customization && (
        <button
          onClick={generateWorksheet}
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
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">⚠️</div>
            <div className="text-red-800 font-medium">{error}</div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg animate-fade-in">
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
                      {result.problems.length} problems
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition-colors flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </button>
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
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
          <div className="p-6">
            {/* Description & Instructions */}
            <div className="mb-6 space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{result.description}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Student Instructions</h4>
                <p className="text-gray-700 bg-blue-50 rounded-lg p-3">{result.instructions}</p>
              </div>
            </div>

            {/* Problems */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Problems & Activities</h4>
              <div className="space-y-4">
                {result.problems.map((problem, index) => (
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
                        <p className="text-gray-900 font-medium mb-2">{problem.question}</p>
                        
                        {problem.options && (
                          <div className="mb-2 space-y-1">
                            {problem.options.map((option, i) => (
                              <div key={i} className="text-sm text-gray-600 pl-4">{option}</div>
                            ))}
                          </div>
                        )}
                        
                        <div className="space-y-2 text-sm">
                          <p className="text-green-700">
                            <strong>Answer:</strong> {problem.answer}
                          </p>
                          <p className="text-gray-600">
                            <strong>Explanation:</strong> {problem.explanation}
                          </p>
                          {problem.christianConnection && (
                            <p className="text-purple-700">
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
                  <ul className="space-y-2">
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
                  <ul className="space-y-2">
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
                <p className="text-gray-700">{result.answerKey}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Download DOCX</span>
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
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
