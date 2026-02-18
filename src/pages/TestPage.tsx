import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuestions } from '../hooks/useQuestions';
import type { Question } from '../hooks/useQuestions';
import { useSession } from '../hooks/useSession';
import { useAdaptiveEngine } from '../hooks/useAdaptiveEngine';

const RANKS = [
  'Apprentice',    // Level 1-2
  'Scholar',       // Level 3-4
  'Expert',        // Level 5-6
  'Master',        // Level 7-8
  'Grandmaster'    // Level 9-10
];

export function TestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const grade = parseInt(searchParams.get('grade') || '5');
  
  const { questions, loading, error } = useQuestions(grade);
  const { session, recordAnswer } = useSession();
  
  const { currentLevel, theme, handleAnswer } = useAdaptiveEngine(questions);
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timer, setTimer] = useState(3600); // 60 minutes

  const currentRank = RANKS[Math.floor((currentLevel - 1) / 2)];

  // Derive available questions for current level that haven't been answered
  const availablePool = useMemo(() => {
    const answeredIds = session.answers.map(a => a.questionId);
    let levelPool = questions.filter(q => q.level === currentLevel && !answeredIds.includes(q.id));
    
    if (levelPool.length === 0 && questions.length > 0) {
      // Fallback: any unanswered question
      const anyUnanswered = questions.filter(q => !answeredIds.includes(q.id));
      if (anyUnanswered.length > 0) {
        // Try to find closest level
        const levels = anyUnanswered.map(q => q.level);
        const closest = levels.reduce((prev, curr) => 
          Math.abs(curr - currentLevel) < Math.abs(prev - currentLevel) ? curr : prev
        );
        levelPool = anyUnanswered.filter(q => q.level === closest);
      }
    }
    return levelPool;
  }, [questions, currentLevel, session.answers]);

  // The current question is the first one in the filtered pool (or stable random)
  // To keep it stable during a "turn", we can use the first one or a dedicated state
  // But using state is safer for when the pool changes but we haven't clicked 'Next'
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Initialize or update current question when pool changes and we don't have one
  useEffect(() => {
    if (!currentQuestion && availablePool.length > 0) {
      setCurrentQuestion(availablePool[0]);
    }
  }, [availablePool, currentQuestion]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (!selectedOption || !currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correct_answer;
    
    // 1. Record the answer (updates session.answers)
    recordAnswer(currentQuestion.id, selectedOption, isCorrect);
    
    // 2. Update adaptive logic (updates currentLevel)
    handleAnswer(isCorrect);

    // 3. Reset local UI state
    setSelectedOption(null);
    setCurrentQuestion(null); // This triggers the useEffect to pick from the NEW pool
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading Grade {grade} challenges...</div>;
  if (error || (questions.length === 0 && !loading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <p className="text-xl text-gray-600 font-medium">No questions found for Grade {grade}.</p>
        <button onClick={() => navigate('/')} className="text-blue-600 font-bold">Return to Grade Selection</button>
      </div>
    );
  }

  // Handle End of Test: No more questions in the global unanswered pool
  const allAnsweredIds = session.answers.map(a => a.questionId);
  const totalUnanswered = questions.filter(q => !allAnsweredIds.includes(q.id)).length;

  if (!currentQuestion && totalUnanswered === 0 && session.answers.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">Challenge Complete!</h2>
          <p className="text-xl text-gray-500 mt-2">Final Rank: {currentRank}</p>
          <p className="text-lg text-gray-400 mt-1">Score: {session.score}/{session.answers.length}</p>
        </div>
        <button 
          onClick={() => navigate('/')} 
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg"
        >
          Return Home
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className={`min-h-screen transition-colors duration-1000 flex flex-col p-4 ${
      theme === 'focus' ? 'bg-blue-50/50' : 'bg-gray-50'
    }`}>
      <header className="max-w-4xl w-full mx-auto flex justify-between items-center py-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Grade {grade} Adaptive Challenge</h2>
          <p className="text-sm text-gray-500 font-medium">Current Rank: {currentRank}</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-lg font-mono font-bold text-blue-600 bg-white border border-blue-100 px-3 py-1 rounded-lg shadow-sm">
            {formatTime(timer)}
          </div>
          <button onClick={() => navigate('/')} className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">
            EXIT
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto py-8 flex flex-col space-y-8">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="mb-10">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                {currentQuestion.type}
              </span>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                currentQuestion.level > 7 ? 'bg-purple-50 text-purple-600' : currentQuestion.level > 4 ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
              }`}>
                Level {currentQuestion.level} / 10
              </span>
            </div>
            <h3 className="text-2xl md:text-4xl font-semibold text-gray-900 leading-tight tracking-tight">
              {currentQuestion.question}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option: string) => (
              <button
                key={option}
                onClick={() => setSelectedOption(option)}
                className={`flex items-center p-6 rounded-2xl border-2 transition-all text-left ${
                  selectedOption === option 
                    ? 'border-blue-600 bg-blue-50/30' 
                    : 'border-transparent hover:border-gray-200 bg-gray-50/50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${
                  selectedOption === option ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                }`}>
                  {selectedOption === option && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                <span className={`text-xl ${selectedOption === option ? 'text-blue-900 font-bold' : 'text-gray-700 font-medium'}`}>
                  {option}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-between">
            <div className="text-sm text-gray-400 font-medium">
              {theme === 'focus' && (
                <span className="text-blue-500 flex items-center italic">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></span>
                  Thematic Shift: Take your time.
                </span>
              )}
            </div>
            <button
              onClick={handleNext}
              disabled={!selectedOption}
              className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xl shadow-gray-200"
            >
              Confirm Selection
            </button>
          </div>
        </div>

        {/* Progressive Challenge Bar */}
        <div className="w-full max-w-md mx-auto text-center">
          <div className="flex justify-between text-[10px] text-gray-400 mb-2 font-black uppercase tracking-[0.2em]">
            <span>Rank: {currentRank}</span>
            <span>Accuracy: {session.answers.length > 0 ? Math.round((session.score / session.answers.length) * 100) : 0}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-1000 ease-in-out" 
              style={{ width: `${(currentLevel / 10) * 100}%` }}
            ></div>
          </div>
        </div>
      </main>
    </div>
  );
}
