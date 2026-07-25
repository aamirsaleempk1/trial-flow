'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import VoiceInput from '@/components/VoiceInput';
import TextInput from '@/components/TextInput';
import PseudoCodeVerification from '@/components/PseudoCodeVerification';
import ExplanationPanel from '@/components/ExplanationPanel';
import ResultsPanel from '@/components/ResultsPanel';
import { sampleTrial } from '@/lib/samples';

type InputMode = 'voice' | 'text';

export default function Home() {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [rawInput, setRawInput] = useState('');
  const [pseudoCode, setPseudoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationMode, setVerificationMode] = useState(false);
  const [results, setResults] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [activeTab, setActiveTab] = useState<'results' | 'explanation'>('results');

  const handleVoiceInput = async (transcript: string, detectedLanguage: string) => {
    setRawInput(transcript);
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPseudoCode(`// Pseudo-code generated from voice input
TRIAL: "Diabetes Study"
DESCRIPTION: "Evaluating AI-powered glucose monitoring"

INCLUDE patients WHERE:
  diagnosis IS "Type 2 Diabetes"
  age BETWEEN 40 AND 75
  a1c_level > 7.0
  language IS "en" OR "es"

EXCLUDE patients WHERE:
  has_condition IS "Severe CKD"

REQUIRE:
  weekly_glucose_readings for 12 weeks`);
    setVerificationMode(true);
    setLoading(false);
  };

  const handleTextInput = async (text: string) => {
    setRawInput(text);
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPseudoCode(`// Pseudo-code generated from text input
TRIAL: "Clinical Trial"
DESCRIPTION: "Patient selection for clinical study"

INCLUDE patients WHERE:
  diagnosis IS "Type 2 Diabetes"
  age BETWEEN 40 AND 75
  a1c_level > 7.0`);
    setVerificationMode(true);
    setLoading(false);
  };

  const handleVerifyAndRun = async (verifiedPseudo: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setResults({
      patients: [
        { id: 'P001', name: 'John Doe', age: 58, sex: 'Male', language: 'en' },
        { id: 'P002', name: 'Maria Garcia', age: 62, sex: 'Female', language: 'es' },
        { id: 'P003', name: 'Wei Chen', age: 55, sex: 'Male', language: 'zh' },
        { id: 'P004', name: 'Sarah Johnson', age: 70, sex: 'Female', language: 'en' },
      ],
      count: 4,
      executionTime: '245ms'
    });
    setExplanation(`## Clinical Trial Explanation

### Variables Used
- **Diagnosis**: Type 2 Diabetes - confirmed by ICD-10 coding
- **Age Range**: 40-75 years - optimal for diabetes intervention studies
- **A1c Level**: >7.0% - indicates poorly controlled diabetes

### Clinical Implications
- Patients with elevated A1c represent high-need population
- Age range captures typical onset and progression timeline
- Multi-language inclusion improves study diversity

### Data Quality
- All patient records verified
- Missing data points excluded
- Confidence: High`);
    setVerificationMode(false);
    setLoading(false);
  };

  const handleRegenerate = () => {
    setVerificationMode(false);
    setPseudoCode('');
    setRawInput('');
    setResults(null);
    setExplanation(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">TF</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">TrialFlow</h1>
              <p className="text-xs text-gray-500">AI-Powered Clinical Trial DSL</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setInputMode('text')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                inputMode === 'text' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ⌨️ Text
            </button>
            <button
              onClick={() => setInputMode('voice')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                inputMode === 'voice' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🎤 Voice
            </button>
          </div>
          
          <button
            onClick={handleRegenerate}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            New Trial
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 border-r border-gray-200 bg-white flex flex-col">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {inputMode === 'voice' ? '🎤 Voice Input' : '⌨️ Text Input'}
            </span>
            <span className="text-xs text-gray-500">
              {inputMode === 'voice' ? 'Speak your trial criteria' : 'Type your trial criteria'}
            </span>
          </div>
          
          <div className="flex-1 p-4">
            {verificationMode ? (
              <PseudoCodeVerification
                pseudoCode={pseudoCode}
                keywords={['diabetes', 'age', 'A1c', 'language', 'CKD']}
                confidence={0.85}
                rawInput={rawInput}
                onVerify={handleVerifyAndRun}
                onCancel={handleRegenerate}
                isLoading={loading}
              />
            ) : inputMode === 'voice' ? (
              <VoiceInput onTranscript={handleVoiceInput} isLoading={loading} />
            ) : (
              <TextInput onTextSubmit={handleTextInput} isLoading={loading} />
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex flex-col bg-gray-50">
          <div className="flex border-b border-gray-200 bg-white">
            <button
              onClick={() => setActiveTab('results')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'results'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Results
            </button>
            <button
              onClick={() => setActiveTab('explanation')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'explanation'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              💡 Explanation
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Processing your trial...</p>
                </div>
              </div>
            ) : activeTab === 'results' ? (
              <ResultsPanel results={results} />
            ) : (
              <ExplanationPanel explanation={explanation} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
