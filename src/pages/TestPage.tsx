import { useNavigate } from 'react-router-dom';

export function TestPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      <header className="max-w-4xl w-full mx-auto flex justify-between items-center py-4">
        <h2 className="text-xl font-semibold text-gray-900">Adaptive Challenge</h2>
        <button 
          onClick={() => navigate('/')}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Exit
        </button>
      </header>
      <main className="flex-1 max-w-4xl w-full mx-auto flex flex-col items-center justify-center space-y-8">
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-lg text-gray-500 italic">Question Engine Placeholder</p>
          <h3 className="text-2xl font-bold mt-4">Loading your first challenge...</h3>
        </div>
        
        {/* Progressive Challenge Bar Placeholder */}
        <div className="w-full max-w-md">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Difficulty Level</span>
            <span>Rank: Beginner</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-1/10 transition-all duration-500"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
