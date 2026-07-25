import VoiceInput from '@/components/VoiceInput';
import TextInput from '@/components/TextInput';
import PseudoCodeVerification from '@/components/PseudoCodeVerification';
import ExplanationPanel from '@/components/ExplanationPanel';
import ResultsPanel from '@/components/ResultsPanel';
import { sampleTrial } from '@/lib/samples';


import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Wand2, FileText } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Languages, AlertCircle, CheckCircle, Zap } from 'lucide-react';

'use client';

interface VoiceInputProps {
  onTranscript: (transcript: string, language: string) => void;
  isLoading: boolean;
}

export default function VoiceInput({ onTranscript, isLoading }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('en');
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Voice input is not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript);
        // Auto-submit after pause
        setTimeout(() => {
          if (finalTranscript.trim().length > 10) {
            onTranscript(finalTranscript.trim(), detectedLanguage);
            stopListening();
          }
        }, 2000);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access.');
      } else {
        setError(`Error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript, detectedLanguage]);

  const startListening = () => {
    setError(null);
    setTranscript('');
    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  if (!isSupported) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Voice Input Unsupported</h3>
          <p className="text-sm text-gray-500 mt-2">Please use the Text Input mode instead</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${
          isListening ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {isListening ? (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Listening...</span>
            </>
          ) : (
            <>
              <MicOff className="w-4 h-4" />
              <span className="text-sm font-medium">Not listening</span>
            </>
          )}
        </div>
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isLoading}
          className={`p-4 rounded-full transition-all ${
            isListening ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30'
          }`}
        >
          {isListening ? (
            <MicOff className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 p-4 overflow-auto">
        {transcript ? (
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Transcript</div>
            <p className="text-gray-800 leading-relaxed">{transcript}</p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              {isListening ? (
                <>
                  <Volume2 className="w-12 h-12 mx-auto mb-3 animate-pulse" />
                  <p>Speak your trial criteria...</p>
                </>
              ) : (
                <>
                  <MicOff className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Click the microphone to start speaking</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}





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
