import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiKey, saveApiKey, deleteApiKey, getTestModality, saveTestModality, isAiEnabled, saveAiEnabled } from '../services/storage';
import type { TestModality } from '../services/storage';
import { validateApiKey } from '../services/ai';
import { Shield, Key, CheckCircle, AlertCircle, Trash2, RefreshCw, Info, Layout, EyeOff, Cpu } from 'lucide-react';

export function SettingsPage() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState(getApiKey() || '');
  const [modality, setModality] = useState<TestModality>(getTestModality());
  const [aiEnabled, setAiEnabled] = useState(isAiEnabled());
  const [isValidating, setIsValidating] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSave = () => {
    if (apiKey.trim()) {
      saveApiKey(apiKey.trim());
      setStatus({ type: 'success', message: 'API Key saved successfully!' });
    }
  };

  const handleDelete = () => {
    deleteApiKey();
    setApiKey('');
    setStatus({ type: 'success', message: 'API Key deleted.' });
  };

  const handleModalityChange = (newModality: TestModality) => {
    setModality(newModality);
    saveTestModality(newModality);
    setStatus({ type: 'success', message: `Test modality updated to ${newModality} mode.` });
  };

  const handleAiToggle = () => {
    const newState = !aiEnabled;
    setAiEnabled(newState);
    saveAiEnabled(newState);
    setStatus({ 
      type: 'success', 
      message: newState ? 'Gemini AI features enabled.' : 'Gemini AI features disabled (using static mode).' 
    });
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setStatus({ type: 'error', message: 'Please enter a key first.' });
      return;
    }

    setIsValidating(true);
    setStatus(null);
    try {
      await validateApiKey(apiKey.trim());
      setStatus({ type: 'success', message: 'Connection successful! Your key is valid.' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setStatus({ type: 'error', message: `Validation failed: ${message}` });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      <header className="max-w-2xl w-full mx-auto flex items-center py-6">
        <button 
          onClick={() => navigate('/')}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
          aria-label="Back to home"
        >
          <RefreshCw size={20} className="rotate-180" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h2>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto py-4">
        <section className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 space-y-8">
          {/* AI Settings Section */}
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Privacy First AI</h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    We use a "Bring Your Own Key" architecture. Your Gemini API key is stored <strong>only in your browser</strong>.
                  </p>
                </div>
              </div>
              
              {/* AI Enable/Disable Toggle */}
              <button
                onClick={handleAiToggle}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  aiEnabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                aria-pressed={aiEnabled}
              >
                <span className="sr-only">Enable Gemini AI</span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    aiEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className={`space-y-4 transition-opacity duration-300 ${aiEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <div className="flex justify-between items-end">
                <label htmlFor="apiKey" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Gemini API Key
                </label>
                {apiKey && (
                  <button 
                    onClick={handleDelete}
                    className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 flex items-center space-x-1"
                  >
                    <Trash2 size={12} />
                    <span>Clear Key</span>
                  </button>
                )}
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                  <Key size={18} />
                </div>
                <input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Google AI API Key..."
                  disabled={!aiEnabled}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-0 outline-hidden transition-all font-mono text-sm disabled:cursor-not-allowed"
                />
              </div>
              <div className="flex items-center space-x-2 text-blue-500 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                <Info size={14} className="shrink-0" />
                <p className="text-[10px] leading-tight font-medium">
                  You can get a free API key from the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline font-bold">Google AI Studio</a>. No credit card is required for basic usage.
                </p>
              </div>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-opacity duration-300 ${aiEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <button 
                onClick={handleTestConnection}
                disabled={!aiEnabled || isValidating || !apiKey.trim()}
                className="flex items-center justify-center space-x-2 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black disabled:opacity-20 transition-all disabled:cursor-not-allowed"
              >
                {isValidating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    <span>Test Connection</span>
                  </>
                )}
              </button>
              
              <button 
                onClick={handleSave}
                disabled={!aiEnabled || !apiKey.trim()}
                className="py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 disabled:opacity-20 transition-all shadow-lg shadow-blue-100 disabled:cursor-not-allowed"
              >
                Save Key
              </button>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Test Modality Section */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                <Layout size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Test Modality</h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  Choose how you want to interact with the challenges. Reasoning is now mandatory for all modes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleModalityChange('combined')}
                className={`flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left ${
                  modality === 'combined' 
                    ? 'border-purple-600 bg-purple-50/30' 
                    : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                }`}
              >
                <div className={`p-2 rounded-lg mb-3 ${modality === 'combined' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <Layout size={18} />
                </div>
                <span className="font-bold text-gray-900">Combined Mode</span>
                <span className="text-xs text-gray-500 mt-1">Multiple-choice options are visible alongside reasoning.</span>
              </button>

              <button
                onClick={() => handleModalityChange('blind')}
                className={`flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left ${
                  modality === 'blind' 
                    ? 'border-purple-600 bg-purple-50/30' 
                    : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                }`}
              >
                <div className={`p-2 rounded-lg mb-3 ${modality === 'blind' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <EyeOff size={18} />
                </div>
                <span className="font-bold text-gray-900">Blind Mode</span>
                <span className="text-xs text-gray-500 mt-1">Options are hidden. You must provide reasoning and the final answer.</span>
              </button>
            </div>
          </div>

          {status && (
            <div className={`p-4 rounded-2xl flex items-start space-x-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
              status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              <div className="mt-0.5">
                {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              </div>
              <span className="text-sm font-medium">{status.message}</span>
            </div>
          )}
        </section>

        <section className="mt-12 text-center flex flex-col items-center space-y-4">
          <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 inline-block">
            <Cpu size={24} />
          </div>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {aiEnabled 
              ? "AI mode is active. You'll receive custom feedback on your reasoning." 
              : "AI mode is disabled. You can still take the challenges using static ideal solutions."}
          </p>
        </section>
      </main>
    </div>
  );
}
