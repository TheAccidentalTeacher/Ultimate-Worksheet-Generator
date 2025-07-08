'use client';

import React, { useState } from 'react';
import { BookOpen, Heart, Sparkles, ArrowRight, Star } from 'lucide-react';

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-300 rounded-full animate-bounce opacity-70"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-pink-300 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute bottom-32 left-20 w-5 h-5 bg-blue-300 rounded-full animate-bounce opacity-50" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-green-300 rounded-full animate-pulse opacity-70" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <BookOpen className="h-8 w-8 text-amber-600" />
                <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1" />
              </div>
              <span className="text-2xl font-bold text-gray-800 font-serif">WorksheetWise</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.location.href = '/login'}
                className="text-gray-600 hover:text-amber-600 transition-colors font-medium"
              >
                Sign In
              </button>
              <button 
                onClick={() => window.location.href = '/login'}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="text-center">
            {/* Mascot Character */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-2xl">
                  <div className="text-6xl">🦉</div>
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg animate-bounce">
                  <Sparkles className="h-4 w-4 text-yellow-700" />
                </div>
                <div className="absolute -bottom-2 -left-2 bg-pink-400 rounded-full p-2 shadow-lg animate-pulse">
                  <Heart className="h-4 w-4 text-pink-700" />
                </div>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="mb-6">
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg mb-4">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-amber-700 font-semibold">Welcome, Amazing Parent!</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight font-serif">
              Create 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                {" "}Magical
              </span>
              <br />
              Coloring & Learning Adventures
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Your creative workspace for crafting whimsical coloring pages and personalized worksheets. 
              Every creation is designed with love, joy, and your child's unique spark in mind. ✨
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={() => setShowOnboarding(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
              >
                <span>Let's Create Together</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button 
                onClick={() => window.location.href = '/login'}
                className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 px-8 py-4 rounded-full text-lg font-semibold border-2 border-amber-200 shadow-lg transition-all"
              >
                Watch How It Works
              </button>
            </div>

            {/* Gentle Onboarding Tooltip */}
            {showOnboarding && (
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl transform animate-fade-in">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🎨</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Let's Get Started!</h3>
                    <p className="text-gray-600 mb-6">
                      I'll guide you through creating the perfect worksheet for your little learner. 
                      It's going to be fun and so easy!
                    </p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setShowOnboarding(false)}
                        className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-full font-semibold"
                      >
                        Maybe Later
                      </button>
                      <button 
                        onClick={() => window.location.href = '/login'}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-full font-semibold"
                      >
                        Let's Go!
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-serif">
              Why Families Love WorksheetWise
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Designed with love by homeschool parents, for creative families everywhere
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 - Focus on Coloring */}
            <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-pink-100">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Magical Coloring Pages</h3>
              <p className="text-gray-600">
                Beautiful, hand-crafted coloring adventures that spark creativity and bring pure joy to learning
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-amber-100">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Whimsical & Joyful</h3>
              <p className="text-gray-600">
                Every creation is filled with delightful touches that make learning feel like a magical adventure
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-blue-100">
              <div className="text-5xl mb-4">💕</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Family-Friendly Values</h3>
              <p className="text-gray-600">
                Wholesome content with optional faith elements, designed to nurture both creativity and character
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-amber-100 to-orange-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <BookOpen className="h-8 w-8 text-amber-600 mr-2" />
              <span className="text-2xl font-bold text-gray-800 font-serif">WorksheetWise</span>
            </div>
            <p className="text-gray-600 mb-4">
              Crafting joyful coloring & learning experiences, one creation at a time
            </p>
            <p className="text-sm text-gray-500">
              Made with 💕 by creative parents, for families who love to learn & color together
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
