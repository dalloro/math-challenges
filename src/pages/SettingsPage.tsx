import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiKey, saveApiKey, deleteApiKey } from '../services/storage';
import { validateApiKey } from '../services/ai';
import { Shield, Key, CheckCircle, AlertCircle, Trash2, RefreshCw } from 'lucide-react';

export function SettingsPage() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState(getApiKey() || '');
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
    } catch (err: any) {
      setStatus({ type: 'error', message: `Validation failed: ${err.message}` });
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
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Privacy First AI</h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                We use a "Bring Your Own Key" architecture. Your Gemini API key is stored <strong>only in your browser</strong> and is never sent to our servers.
              </p>
            </div>
          </div>

          <div className="space-y-4">
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
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-0 outline-hidden transition-all font-mono text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={handleTestConnection}
              disabled={isValidating || !apiKey.trim()}
              className="flex items-center justify-center space-x-2 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black disabled:opacity-20 transition-all"
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
              disabled={!apiKey.trim()}
              className="py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 disabled:opacity-20 transition-all shadow-lg shadow-blue-100"
            >
              Save Key
            </button>
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

        <section className="mt-12 text-center">
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Don't have a key? You can still take the challenges! The app will fall back to static ideal solutions.
          </p>
        </section>
      </main>
    </div>
  );
}
