import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <header>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Math Challenges
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Gifted-level math testing and learning for students.
          </p>
        </header>
        <main>
          <button 
            onClick={() => navigate('/test')}
            className="btn-primary"
          >
            Start Challenge
          </button>
        </main>
        <footer className="pt-8 flex flex-col items-center space-y-4">
          <button 
            onClick={() => navigate('/settings')}
            className="text-sm text-blue-600 hover:underline"
          >
            Settings & API Key
          </button>
          <p className="text-sm text-gray-400">
            Adaptive Testing • AI-Powered Reasoning • Gifted Curriculum
          </p>
        </footer>
      </div>
    </div>
  );
}
