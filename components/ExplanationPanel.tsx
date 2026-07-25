'use client';

import { motion } from 'framer-motion';
import { Brain, Link, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface ExplanationProps {
  explanation: any;
}

export default function ExplanationPanel({ explanation }: ExplanationProps) {
  if (!explanation) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>Run a trial to see the explanation here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Brain className="w-5 h-5 text-purple-600 mr-2" />
          Clinical Explanation
        </h3>
        <div className="prose prose-sm max-w-none text-gray-600">
          <p>{explanation}</p>
        </div>
      </div>
    </div>
  );
}
