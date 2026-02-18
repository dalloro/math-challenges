import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    alert('Settings saved!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      <header className="max-w-2xl w-full mx-auto flex items-center py-4">
        <button 
          onClick={() => navigate('/')}
          className="mr-4 text-gray-400 hover:text-gray-600"
        >
          ← Back
        </button>
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
      </header>
      <main className="flex-1 max-w-2xl w-full mx-auto py-8">
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">AI Features</h3>
            <p className="text-sm text-gray-500 mt-1">
              Provide your Gemini API key to enable open-ended reasoning evaluation and real-time feedback.
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
              Gemini API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your key here"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
            />
            <p className="text-xs text-gray-400">
              Your key is stored locally in your browser and never sent to our servers.
            </p>
          </div>
          <button 
            onClick={handleSave}
            className="btn-primary w-full"
          >
            Save Settings
          </button>
        </section>
      </main>
    </div>
  );
}
