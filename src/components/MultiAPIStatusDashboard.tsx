// Multi-API Status Dashboard
// Shows which APIs are being used for worksheet generation and their status

'use client';

import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle, AlertCircle, Zap, Image, Search, Users, Youtube, Wifi } from 'lucide-react';

interface APIStatus {
  name: string;
  key: string;
  status: 'active' | 'inactive' | 'error' | 'testing';
  category: 'content' | 'visual' | 'research' | 'social' | 'enhancement';
  lastUsed?: string;
  usage?: number;
  icon: React.ReactNode;
}

export default function MultiAPIStatusDashboard() {
  const [apis, setApis] = useState<APIStatus[]>([
    // Content Generation APIs
    { name: 'OpenAI GPT-4', key: 'OPENAI_API_KEY', status: 'active', category: 'content', usage: 85, icon: <Zap className="w-4 h-4" /> },
    { name: 'Azure AI Foundry', key: 'AZURE_AI_FOUNDRY_KEY', status: 'active', category: 'content', usage: 12, icon: <Zap className="w-4 h-4" /> },
    { name: 'Azure AI Foundry 2', key: 'AZURE_AI_FOUNDRY_KEY_2', status: 'inactive', category: 'content', usage: 3, icon: <Zap className="w-4 h-4" /> },
    
    // Visual APIs
    // eslint-disable-next-line jsx-a11y/alt-text
    { name: 'Stability AI', key: 'STABILITY_AI_API_KEY', status: 'active', category: 'visual', usage: 45, icon: <Image className="w-4 h-4" /> },
    // eslint-disable-next-line jsx-a11y/alt-text
    { name: 'Replicate', key: 'REPLICATE_API_TOKEN', status: 'active', category: 'visual', usage: 15, icon: <Image className="w-4 h-4" /> },
    // eslint-disable-next-line jsx-a11y/alt-text
    { name: 'Unsplash', key: 'UNSPLASH_ACCESS_KEY', status: 'active', category: 'visual', usage: 78, icon: <Image className="w-4 h-4" /> },
    // eslint-disable-next-line jsx-a11y/alt-text
    { name: 'Pexels', key: 'PEXELS_API_KEY', status: 'active', category: 'visual', usage: 34, icon: <Image className="w-4 h-4" /> },
    // eslint-disable-next-line jsx-a11y/alt-text
    { name: 'Pixabay', key: 'PIXABAY_API_KEY', status: 'active', category: 'visual', usage: 22, icon: <Image className="w-4 h-4" /> },
    
    // Research APIs
    { name: 'SerpAPI', key: 'SERPAPI_KEY', status: 'active', category: 'research', usage: 28, icon: <Search className="w-4 h-4" /> },
    { name: 'News API', key: 'NEWS_API_KEY', status: 'active', category: 'research', usage: 16, icon: <Search className="w-4 h-4" /> },
    { name: 'YouTube API', key: 'YOUTUBE_API_KEY', status: 'active', category: 'research', usage: 41, icon: <Youtube className="w-4 h-4" /> },
    
    // Social APIs
    { name: 'Reddit API', key: 'REDDIT_CLIENT_ID', status: 'active', category: 'social', usage: 19, icon: <Users className="w-4 h-4" /> },
    { name: 'Giphy', key: 'GIPHY_API_KEY', status: 'active', category: 'enhancement', usage: 31, icon: <Activity className="w-4 h-4" /> },
  ]);

  const [lastWorksheet, setLastWorksheet] = useState<any>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'testing': return <Wifi className="w-4 h-4 text-blue-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'content': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'visual': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'research': return 'bg-green-100 text-green-800 border-green-200';
      case 'social': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'enhancement': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const categories = ['content', 'visual', 'research', 'social', 'enhancement'];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Multi-API Status Dashboard
        </h2>
        <p className="text-gray-600 mb-6">
          Monitor all 16 APIs working together to create intelligent, enhanced worksheets
        </p>

        {/* API Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {categories.map(category => {
            const categoryAPIs = apis.filter(api => api.category === category);
            const activeCount = categoryAPIs.filter(api => api.status === 'active').length;
            
            return (
              <div key={category} className="border rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center justify-between">
                  <span className="capitalize">{category} APIs</span>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getCategoryColor(category)}`}>
                    {activeCount}/{categoryAPIs.length} active
                  </span>
                </h3>
                
                <div className="space-y-2">
                  {categoryAPIs.map(api => (
                    <div key={api.key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {api.icon}
                        <span className="text-sm font-medium">{api.name}</span>
                        {getStatusIcon(api.status)}
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Usage</div>
                        <div className="text-sm font-medium">{api.usage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Smart Routing Example */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">🧠 Smart API Selection Example</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <div><strong>Math Worksheet, 3rd Grade:</strong></div>
            <div>• Primary: OpenAI GPT-4 (creative problem generation)</div>
            <div>• Visual: Stability AI (custom math diagrams)</div>
            <div>• Backup: Azure AI Foundry → Azure AI Foundry 2</div>
            <div>• Enhancement: Unsplash (educational imagery)</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-900 mb-2">📊 Science Worksheet, 8th Grade:</h3>
          <div className="text-sm text-green-800 space-y-1">
            <div>• Primary: Azure AI Foundry (structured content)</div>
            <div>• Visual: Unsplash + Pexels (real science photos)</div>
            <div>• Research: SerpAPI (current discoveries)</div>
            <div>• Enhancement: YouTube API (video suggestions)</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h3 className="font-medium text-purple-900 mb-2">✝️ Bible Studies, High School:</h3>
          <div className="text-sm text-purple-800 space-y-1">
            <div>• Primary: OpenAI GPT-4 (deep theological content)</div>
            <div>• Visual: Unsplash (biblical imagery)</div>
            <div>• Research: News API (faith and current events)</div>
            <div>• Social: Reddit API (community discussions)</div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">16</div>
            <div className="text-sm text-gray-600">Total APIs</div>
          </div>
          <div className="bg-white border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{apis.filter(api => api.status === 'active').length}</div>
            <div className="text-sm text-gray-600">Active APIs</div>
          </div>
          <div className="bg-white border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">95%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          <div className="bg-white border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">2.3s</div>
            <div className="text-sm text-gray-600">Avg Response</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h3 className="font-medium mb-3">🔄 Recent API Activity</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>5th Grade Math - Fractions</span>
              <span className="text-green-600">OpenAI + Stability AI + Unsplash</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>8th Grade Science - Cells</span>
              <span className="text-blue-600">Azure AI + Pexels + SerpAPI</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>Bible Studies - Parables</span>
              <span className="text-purple-600">OpenAI + Unsplash + News API</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
