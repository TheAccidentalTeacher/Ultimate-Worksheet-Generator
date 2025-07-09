'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface OpenAIIntegrationsProps {
  onWorksheetGenerated?: (worksheet: any) => void;
}

export function OpenAIIntegrations({ onWorksheetGenerated }: OpenAIIntegrationsProps) {
  const [activeTab, setActiveTab] = useState('vision');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [textToRead, setTextToRead] = useState('');
  const [voiceSettings, setVoiceSettings] = useState({
    voice: 'alloy',
    speed: 1.0
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // GPT-4 Vision - Image Analysis
  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: selectedImage,
          subject: 'general',
          grade: 'elementary',
          worksheetType: 'educational'
        })
      });
      
      const data = await response.json();
      setResult(data);
      
      if (data.worksheet && onWorksheetGenerated) {
        onWorksheetGenerated(data.worksheet);
      }
    } catch (error) {
      console.error('Image analysis error:', error);
      setResult({ error: 'Failed to analyze image' });
    } finally {
      setLoading(false);
    }
  };

  // Text-to-Speech
  const generateSpeech = async () => {
    if (!textToRead.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToRead,
          voice: voiceSettings.voice,
          speed: voiceSettings.speed
        })
      });
      
      const data = await response.json();
      
      if (data.audioData && audioRef.current) {
        audioRef.current.src = data.audioData;
        audioRef.current.load();
      }
      
      setResult(data);
    } catch (error) {
      console.error('TTS error:', error);
      setResult({ error: 'Failed to generate speech' });
    } finally {
      setLoading(false);
    }
  };

  // Speech-to-Text
  const transcribeAudio = async () => {
    if (!audioFile) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('language', 'en');
      formData.append('prompt', 'Educational worksheet generation request');
      
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('STT error:', error);
      setResult({ error: 'Failed to transcribe audio' });
    } finally {
      setLoading(false);
    }
  };

  // Function Calling - Advanced Generation
  const generateAdvancedWorksheet = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userSelections: {
            subject: 'Math',
            grade: '5th',
            topic: 'Fractions',
            difficulty: 'medium',
            numberOfQuestions: 8,
            specialRequirements: 'Include visual examples and real-world applications'
          }
        })
      });
      
      const data = await response.json();
      setResult(data);
      
      if (data.worksheet && onWorksheetGenerated) {
        onWorksheetGenerated(data.worksheet);
      }
    } catch (error) {
      console.error('Advanced generation error:', error);
      setResult({ error: 'Failed to generate worksheet' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'vision':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">🖼️ GPT-4 Vision - Image Analysis</h3>
            <p className="text-gray-600">Upload or provide an image URL to generate worksheets based on what&apos;s shown.</p>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Image URL:</label>
              <input
                type="url"
                value={selectedImage}
                onChange={(e) => setSelectedImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full p-2 border rounded"
              />
            </div>
            
            {selectedImage && (
              <div className="border rounded p-4">
                <Image src={selectedImage} alt="Preview" className="max-w-xs max-h-48 object-contain" width={300} height={200} />
              </div>
            )}
            
            <button
              onClick={analyzeImage}
              disabled={loading || !selectedImage}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded"
            >
              {loading ? 'Analyzing...' : 'Analyze Image & Generate Worksheet'}
            </button>
          </div>
        );

      case 'tts':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">🔊 Text-to-Speech</h3>
            <p className="text-gray-600">Convert worksheet text to audio for accessibility.</p>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Text to convert:</label>
              <textarea
                value={textToRead}
                onChange={(e) => setTextToRead(e.target.value)}
                placeholder="Enter worksheet instructions, questions, or any text..."
                className="w-full p-2 border rounded h-32"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Voice:</label>
                <select
                  value={voiceSettings.voice}
                  onChange={(e) => setVoiceSettings({...voiceSettings, voice: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="alloy">Alloy</option>
                  <option value="echo">Echo</option>
                  <option value="fable">Fable</option>
                  <option value="onyx">Onyx</option>
                  <option value="nova">Nova</option>
                  <option value="shimmer">Shimmer</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium">Speed: {voiceSettings.speed}x</label>
                <input
                  type="range"
                  min="0.25"
                  max="4.0"
                  step="0.25"
                  value={voiceSettings.speed}
                  onChange={(e) => setVoiceSettings({...voiceSettings, speed: parseFloat(e.target.value)})}
                  className="w-full"
                />
              </div>
            </div>
            
            <button
              onClick={generateSpeech}
              disabled={loading || !textToRead.trim()}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded"
            >
              {loading ? 'Generating...' : 'Generate Audio'}
            </button>
            
            <audio ref={audioRef} controls className="w-full" />
          </div>
        );

      case 'stt':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">🎤 Speech-to-Text (Whisper)</h3>
            <p className="text-gray-600">Upload audio to generate worksheet parameters from voice input.</p>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Upload audio file:</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="w-full p-2 border rounded"
              />
            </div>
            
            {audioFile && (
              <div className="text-sm text-gray-600">
                Selected: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
            
            <button
              onClick={transcribeAudio}
              disabled={loading || !audioFile}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white px-4 py-2 rounded"
            >
              {loading ? 'Transcribing...' : 'Transcribe & Generate Parameters'}
            </button>
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">⚡ Advanced Generation (Function Calling)</h3>
            <p className="text-gray-600">Use structured function calls for more reliable worksheet generation.</p>
            
            <div className="bg-blue-50 p-4 rounded">
              <h4 className="font-medium mb-2">Sample Parameters:</h4>
              <ul className="text-sm space-y-1">
                <li>• Subject: Math</li>
                <li>• Grade: 5th</li>
                <li>• Topic: Fractions</li>
                <li>• Questions: 8</li>
                <li>• Special: Visual examples & real-world applications</li>
              </ul>
            </div>
            
            <button
              onClick={generateAdvancedWorksheet}
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white px-4 py-2 rounded"
            >
              {loading ? 'Generating...' : 'Generate Advanced Worksheet'}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">🚀 OpenAI Integrations Showcase</h2>
        <p className="text-gray-600">Explore all the OpenAI features available in your worksheet generator.</p>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 border-b">
        {[
          { id: 'vision', label: '🖼️ GPT-4 Vision', desc: 'Image Analysis' },
          { id: 'tts', label: '🔊 Text-to-Speech', desc: 'Audio Generation' },
          { id: 'stt', label: '🎤 Speech-to-Text', desc: 'Voice Input' },
          { id: 'advanced', label: '⚡ Function Calling', desc: 'Structured Output' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="text-sm">{tab.label}</div>
            <div className="text-xs text-gray-400">{tab.desc}</div>
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        {renderTab()}
      </div>
      
      {/* Results */}
      {result && (
        <div className="bg-gray-50 border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Results:</h3>
          <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
