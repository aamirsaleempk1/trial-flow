'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Edit2, ThumbsUp, ThumbsDown, AlertCircle, Sparkles, Shield } from 'lucide-react';

interface PseudoCodeVerificationProps {
  pseudoCode: string;
  keywords: string[];
  confidence: number;
  rawInput: string;
  onVerify: (verifiedPseudo: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function PseudoCodeVerification({
  pseudoCode,
  keywords,
  confidence,
  rawInput,
  onVerify,
  onCancel,
  isLoading,
}: PseudoCodeVerificationProps) {
  const [editedPseudo, setEditedPseudo] = useState(pseudoCode);
  const [editing, setEditing] = useState(false);
  const [feedback, setFeedback] = useState<'good' | 'bad' | null>(null);

  const handleVerify = () => {
    if (feedback === 'bad') {
      setEditing(true);
      return;
    }
    onVerify(editedPseudo);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-800">Pseudo-code Generated</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">Confidence: {Math.round(confidence * 100)}%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Extracted Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">
                {editing ? '✏️ Editing Pseudo-code' : 'Generated Pseudo-code'}
              </h3>
              <button
                onClick={() => setEditing(!editing)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                <Edit2 className="w-3 h-3 inline mr-1" />
                {editing ? 'Done' : 'Edit'}
              </button>
            </div>
            {editing ? (
              <textarea
                value={editedPseudo}
                onChange={(e) => setEditedPseudo(e.target.value)}
                className="w-full h-48 p-4 border border-gray-300 rounded-xl font-mono text-sm resize-none"
              />
            ) : (
              <pre className="w-full h-48 p-4 bg-gray-900 text-green-300 rounded-xl font-mono text-sm overflow-auto">
                {editedPseudo}
              </pre>
            )}
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Is this correct?</p>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setFeedback('good')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  feedback === 'good'
                    ? 'bg-green-100 text-green-700 border-2 border-green-500'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Yes, looks good</span>
              </button>
              <button
                onClick={() => setFeedback('bad')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  feedback === 'bad'
                    ? 'bg-red-100 text-red-700 border-2 border-red-500'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>Needs correction</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <X className="w-4 h-4 inline mr-2" />
            Cancel
          </button>
          <button
            onClick={handleVerify}
            disabled={isLoading || !feedback}
            className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 inline mr-2" />
                Verify & Run Trial
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
