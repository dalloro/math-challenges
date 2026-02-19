import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import packageJson from '../../package.json';

export function LandingPage() {
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState<number>(5);

  const handleStart = () => {
    navigate(`/test?grade=${selectedGrade}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full text-center space-y-12">
        <header>
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4">
            Alpha v{packageJson.version}
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Math Challenges
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            Experience gifted-level assessment and AI-powered Socratic learning. Fully automated deployment active.
          </p>
        </header>

        <main className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
          <div className="space-y-4">
            <label htmlFor="grade-select" className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Select Your Grade Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`py-3 rounded-xl text-sm font-bold transition-all ${
                    selectedGrade === grade
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleStart}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
          >
            Start Adaptive Challenge
          </button>
        </main>

        <footer className="flex flex-col items-center space-y-6">
          <button 
            onClick={() => navigate('/settings')}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Settings & API Configuration
          </button>
          <div className="flex space-x-4 text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
            <span>Adaptive</span>
            <span>•</span>
            <span>Socratic AI</span>
            <span>•</span>
            <span>Gifted Pool</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
