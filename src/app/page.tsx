'use client';

import React from 'react';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-primary-50">
      <div className="max-w-xl mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-primary-700 mb-4">Homeschool Worksheets AI</h1>
        <p className="text-lg text-gray-700 mb-6">
          Instantly generate K-12, faith-integrated, standards-aligned homeschool worksheets with AI.<br />
          <span className="font-semibold text-primary-600">No stress. No copy-paste. Just learning and fun!</span>
        </p>
        <div className="flex flex-col gap-4">
          <a href="/signup" className="bg-primary-500 hover:bg-primary-600 text-white rounded px-6 py-3 text-lg font-bold transition">Get Started Free</a>
          <a href="/login" className="text-primary-600 hover:underline">Already have an account? Sign in</a>
        </div>
      </div>
    </main>
  );
}
