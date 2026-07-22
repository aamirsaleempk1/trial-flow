'use client';

import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">🧪 TrialFlow</h1>
          <p className="text-gray-600 mt-2">Clinical Trial DSL - Coming Soon</p>
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700">
              ⚡ Project setup in progress. Check back for the full interface!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
