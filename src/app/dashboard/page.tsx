'use client';

import React, { useState, useEffect } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useRouter } from 'next/navigation';
import { BookOpen, Palette, BarChart3, Sparkles, Heart } from 'lucide-react';
import EnhancedWorksheetGenerator from '@/components/EnhancedWorksheetGenerator';
import ColoringSheetGenerator from '@/components/ColoringSheetGenerator';
import MultiAPIStatusDashboard from '@/components/MultiAPIStatusDashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('worksheets');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      router.push('/login');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">WorksheetWise</h1>
                  <p className="text-sm text-gray-600">Your AI Learning Companion</p>
                </div>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('auth-token');
                  router.push('/login');
                }}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Magical Worksheet Creator
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Let&apos;s craft the perfect learning adventure for your precious ones! <Heart className="inline w-5 h-5 text-pink-500" />
            </p>

            <div className="inline-flex bg-white rounded-lg p-1 shadow-sm border">
              <button
                onClick={() => setActiveTab('worksheets')}
                className={`px-6 py-3 rounded-md font-medium transition-all flex items-center space-x-2 ${
                  activeTab === 'worksheets'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Enhanced Worksheets</span>
              </button>
              <button
                onClick={() => setActiveTab('coloring')}
                className={`px-6 py-3 rounded-md font-medium transition-all flex items-center space-x-2 ${
                  activeTab === 'coloring'
                    ? 'bg-pink-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Coloring Sheets</span>
              </button>
              <button
                onClick={() => setActiveTab('status')}
                className={`px-6 py-3 rounded-md font-medium transition-all flex items-center space-x-2 ${
                  activeTab === 'status'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>API Status</span>
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {activeTab === 'worksheets' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <EnhancedWorksheetGenerator />
              </div>
            )}

            {activeTab === 'coloring' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <ColoringSheetGenerator 
                  theme="animals"
                  ageGroup="elementary"
                  faithLevel={2}
                />
              </div>
            )}

            {activeTab === 'status' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <MultiAPIStatusDashboard />
              </div>
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}