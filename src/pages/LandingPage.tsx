import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import packageJson from '../../package.json';

export function LandingPage() {
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [activeRoomCode, setActiveRoomCode] = useState<string | null>(null);

  useEffect(() => {
    const savedCode = localStorage.getItem('math_challenge_room_code');
    if (savedCode) {
      setActiveRoomCode(savedCode);
    }
  }, []);

  const handleStart = () => {
    if (selectedGrade !== null) {
      // Clear old room code when starting a fresh test
      localStorage.removeItem('math_challenge_room_code');
      navigate(`/test?grade=${selectedGrade}`);
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCodeInput.trim().length > 0) {
      navigate(`/test?room=${roomCodeInput.trim().toUpperCase()}`);
    }
  };

  const handleResume = () => {
    if (activeRoomCode) {
      navigate(`/test?room=${activeRoomCode}`);
    }
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
            Experience gifted-level assessment and AI-powered Socratic learning.
          </p>
        </header>

        <main className="space-y-8">
          {/* New Test Section */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Start a New Challenge
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
              disabled={selectedGrade === null}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xl shadow-blue-100"
            >
              Start New Test
            </button>
          </section>

          {/* Join Room Section */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Resume with Room Code
              </label>
              <form onSubmit={handleJoinRoom} className="flex gap-2">
                <input
                  type="text"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  placeholder="Room Code"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono font-bold text-center"
                />
                <button
                  type="submit"
                  disabled={!roomCodeInput.includes('-')}
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold disabled:opacity-20 transition-all"
                >
                  Join
                </button>
              </form>
            </div>

            {activeRoomCode && (
              <div className="pt-2">
                <button
                  onClick={handleResume}
                  className="w-full py-3 bg-green-50 text-green-700 rounded-xl font-bold text-sm hover:bg-green-100 transition-all border border-green-100"
                >
                  Resume Active Session ({activeRoomCode})
                </button>
              </div>
            )}
          </section>
        </main>

        <footer className="flex flex-col items-center space-y-6">
          <button 
            onClick={() => navigate('/settings')}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Settings & API Configuration
          </button>
          <div className="flex space-x-4 text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
            <span>Persistent Rooms</span>
            <span>•</span>
            <span>Socratic AI</span>
            <span>•</span>
            <span>Adaptive</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
