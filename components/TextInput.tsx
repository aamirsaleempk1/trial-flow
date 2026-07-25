'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Wand2, FileText } from 'lucide-react';

interface TextInputProps {
  onTextSubmit: (text: string) => void;
  isLoading: boolean;
}

export default function TextInput({ onTextSubmit, isLoading }: TextInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 300)}px`;
    }
  }, [text]);

  const handleSubmit = () => {
    if (text.trim().length > 10) {
      onTextSubmit(text.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const examples = [
    'Type 2 Diabetes patients age 40-75 with A1c > 7.0, English or Spanish speakers',
    'Patients with hypertension, age 45-70, BMI > 25',
    'Adults with confirmed COVID-19, oxygen saturation < 94%',
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your trial criteria in plain language..."
          className="w-full h-full resize-none p-4 border border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all font-sans text-gray-800"
          disabled={isLoading}
        />
      </div>

      <div className="mt-3">
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
          <FileText className="w-3 h-3" />
          <span>Quick examples:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => setText(example)}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
            >
              {example.length > 30 ? example.substring(0, 30) + '...' : example}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <Wand2 className="w-3 h-3" />
          <span>AI will extract keywords and generate pseudo-code</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading || text.length < 10}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Generate Trial</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
