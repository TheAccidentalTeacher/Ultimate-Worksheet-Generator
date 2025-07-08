'use client';

import React from 'react';
import WorksheetGenerator from '@/components/WorksheetGenerator';

export default function DashboardPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-primary-50">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-md p-8 mt-12">
        <h2 className="text-3xl font-bold text-primary-700 mb-4">Worksheet Generator Dashboard</h2>
        <p className="mb-6 text-gray-700">
          Welcome! Use the generator below to create customized worksheets for any grade, subject, or style.
        </p>
        <WorksheetGenerator />
      </div>
    </main>
  );
}
