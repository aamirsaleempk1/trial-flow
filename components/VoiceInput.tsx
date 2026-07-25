'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Languages, AlertCircle, CheckCircle, Zap } from 'lucide-react';

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
