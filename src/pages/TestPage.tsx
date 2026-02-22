import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuestions } from '../hooks/useQuestions';
import type { Question } from '../hooks/useQuestions';
import { useSession } from '../hooks/useSession';
import { useAdaptiveEngine } from '../hooks/useAdaptiveEngine';
import { useRoom } from '../hooks/useRoom';
import type { RoomState } from '../hooks/useRoom';
import { evaluateReasoning } from '../services/ai';
import { getApiKey } from '../services/storage';
import { SolutionDisplay } from '../components/SolutionDisplay';
import { parseIdealSolution } from '../utils/solutionParser';
import { Logo } from '../components/Logo';

const RANKS = [
  'Apprentice',    // Level 1-2
  'Scholar',       // Level 3-4
  'Expert',        // Level 5-6
  'Master',        // Level 7-8
  'Grandmaster'    // Level 9-10
];

const INACTIVITY_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

type Modality = 'mcq' | 'reasoning';

interface TestEngineProps {
  grade: number;
  initialRoomState: RoomState;
  onSync: (updates: Partial<RoomState>) => void;
  roomCode: string;
}

function TestEngine({ grade, initialRoomState, onSync, roomCode }: TestEngineProps) {
  const navigate = useNavigate();
  const { questions, loading, error } = useQuestions(grade);
  
  // Initialize session with restored state
  const { session, recordAnswer } = useSession({
    score: initialRoomState.score,
    answers: initialRoomState.answers,
    currentQuestionIndex: initialRoomState.answers.length
  });
  
  // Initialize adaptive engine with restored level and streak
  const { currentLevel, theme, handleAnswer, streak } = useAdaptiveEngine(
    questions, 
    initialRoomState.currentLevel,
    initialRoomState.streak
  );
  
  const [modality, setModality] = useState<Modality>('mcq');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'ai' | 'ideal' | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  
  const [timer, setTimer] = useState(initialRoomState.remainingSeconds);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [timerVisible, setTimerVisible] = useState(() => {
    const stored = localStorage.getItem('math_timer_visible');
    return stored === null ? true : stored === 'true';
  });

  const currentRank = RANKS[Math.floor((currentLevel - 1) / 2)];

  const isActive = useMemo(() => Date.now() - lastActivity < INACTIVITY_THRESHOLD_MS, [lastActivity]);
  const isStaticMode = useMemo(() => !getApiKey(), []);

  // Track user activity (mouse, touch, keyboard)
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('touchstart', updateActivity);
    window.addEventListener('click', updateActivity);
    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('touchstart', updateActivity);
      window.removeEventListener('click', updateActivity);
    };
  }, []);

  // Derive available pool for current level
  const availablePool = useMemo(() => {
    const answeredIds = session.answers.map(a => a.questionId);
    let pool = questions.filter(q => q.level === currentLevel && !answeredIds.includes(q.id));
    
    if (pool.length === 0 && questions.length > 0) {
      const anyUnanswered = questions.filter(q => !answeredIds.includes(q.id));
      if (anyUnanswered.length > 0) {
        const levels = anyUnanswered.map(q => q.level);
        const closest = levels.reduce((prev, curr) => 
          Math.abs(curr - currentLevel) < Math.abs(prev - currentLevel) ? curr : prev
        );
        pool = anyUnanswered.filter(q => q.level === closest);
      }
    }
    return pool;
  }, [questions, currentLevel, session.answers]);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const initializedFromRoom = useRef(false);

  // Question Selection Logic
  useEffect(() => {
    if (questions.length === 0 || currentQuestion) return;

    // 1. Try to restore the question from the room state ONCE
    if (!initializedFromRoom.current && initialRoomState.currentQuestionId) {
      const restored = questions.find(q => q.id === initialRoomState.currentQuestionId);
      const isAlreadyAnswered = session.answers.some(a => a.questionId === initialRoomState.currentQuestionId);
      
      if (restored && !isAlreadyAnswered) {
        setCurrentQuestion(restored);
        initializedFromRoom.current = true;
        return;
      }
    }

    // 2. Otherwise pick randomly from the pool
    if (availablePool.length > 0) {
      const randomIndex = Math.floor(Math.random() * availablePool.length);
      const picked = availablePool[randomIndex];
      setCurrentQuestion(picked);
      onSync({ currentQuestionId: picked.id });
      initializedFromRoom.current = true;
    }
  }, [availablePool, currentQuestion, questions, initialRoomState.currentQuestionId, session.answers, onSync]);

  // Timer Countdown Logic: Only if active
  useEffect(() => {
    const interval = setInterval(() => {
      if (isActive) {
        setTimer(t => (t > 0 ? t - 1 : 0));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  // Periodic Timer Sync: Every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      if (isActive) {
        onSync({ remainingSeconds: timer });
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [onSync, isActive, timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (!selectedOption || !currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correct_answer;
    recordAnswer(currentQuestion.id, selectedOption, isCorrect);
    handleAnswer(isCorrect);

    // Sync all state changes back to room immediately on confirm
    onSync({ 
      currentLevel, 
      streak, 
      score: session.score + (isCorrect ? 1 : 0), 
      answers: [
        ...session.answers,
        { questionId: currentQuestion.id, answer: selectedOption, isCorrect, timestamp: Date.now() }
      ],
      remainingSeconds: timer,
      currentQuestionId: null // Clear so next effect picks a new one
    });

    setSelectedOption(null);
    setCurrentQuestion(null);
    setReasoning('');
    setModality('mcq');
    setAiFeedback(null);
    setFeedbackType(null);
    setFeedbackError(null);
  };

  const handleSubmitReasoning = async () => {
    if (!reasoning || !currentQuestion) return;
    setIsSubmitting(true);
    setFeedbackError(null);
    
    const apiKey = getApiKey();
    
    if (!apiKey) {
      // STATIC MODE: No API key found in localStorage
      setAiFeedback(currentQuestion.ideal_solution);
      setFeedbackType('ideal');
      setIsSubmitting(false);
      return;
    }

    try {
      const feedback = await evaluateReasoning(
        currentQuestion.question,
        reasoning,
        currentQuestion.ideal_solution,
        apiKey
      );
      setAiFeedback(feedback);
      setFeedbackType('ai');
    } catch (err) {
      console.error("AI reasoning failed:", err);
      setFeedbackError("AI Configuration Error: Failed to reach the service. Check your API key in Settings.");
    } finally {
      setIsSubmitting(false);
    }
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
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg">
          Return Home
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className={`min-h-screen transition-colors duration-1000 flex flex-col p-2 sm:p-4 ${
      theme === 'focus' ? 'bg-blue-50/50' : 'bg-gray-50'
    }`}>
      <header className="max-w-4xl w-full mx-auto flex justify-between items-center py-2 sm:py-4">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Logo className="h-7 sm:h-10 w-auto" />
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <h2 className="text-sm sm:text-xl font-semibold text-gray-900 tracking-tight">
                Grade {grade} <span className="hidden sm:inline">Adaptive Challenge</span>
              </h2>
              {isStaticMode && (
                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-400 text-[7px] sm:text-[8px] font-black uppercase tracking-widest rounded border border-gray-200">
                  Static Mode
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-sm text-gray-500 font-medium">
              <span className="hidden sm:inline">Room: </span>
              <span className="font-mono text-blue-600 font-bold uppercase">{roomCode}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-6">
          <div 
            onClick={() => {
              const newState = !timerVisible;
              setTimerVisible(newState);
              localStorage.setItem('math_timer_visible', String(newState));
            }}
            className="text-sm sm:text-lg font-mono font-bold text-blue-600 bg-white border border-blue-100 px-2 sm:px-3 py-1 rounded-lg shadow-sm cursor-pointer hover:bg-blue-50 transition-colors"
          >
            {timerVisible ? formatTime(timer) : (
              <span className="text-[8px] sm:text-[10px] uppercase tracking-widest flex items-center">
                Show Timer
              </span>
            )}
          </div>
          <button onClick={() => navigate('/')} className="text-[10px] sm:text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">
            EXIT
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto py-8 flex flex-col space-y-8">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="mb-10">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                  {currentQuestion.type}
                </span>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                  currentLevel > 7 ? 'bg-purple-50 text-purple-600' : currentLevel > 4 ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                }`}>
                  Level {currentQuestion.level} / 10
                </span>
              </div>
              
              {!aiFeedback && (
                <button 
                  onClick={() => setModality(modality === 'mcq' ? 'reasoning' : 'mcq')}
                  className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {modality === 'mcq' ? 'Switch to Reasoning' : 'Switch to Multiple Choice'}
                </button>
              )}
            </div>
            
            <h3 className="text-2xl md:text-4xl font-semibold text-gray-900 leading-tight tracking-tight">
              {currentQuestion.question}
            </h3>
          </div>

          {!aiFeedback ? (
            modality === 'mcq' ? (
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
            ) : (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-full mb-1">Available Options:</span>
                  {currentQuestion.options.map((option: string, idx: number) => (
                    <span key={option} className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-500 font-bold">
                      {String.fromCharCode(65 + idx)}) {option}
                    </span>
                  ))}
                </div>

                <textarea
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  placeholder="Explain your reasoning step-by-step..."
                  className="w-full h-64 p-6 rounded-2xl border-2 border-gray-100 focus:border-blue-500 focus:ring-0 outline-none text-xl text-gray-800 placeholder-gray-300 resize-none transition-all bg-gray-50/30"
                />
                
                {feedbackError && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                    {feedbackError}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleSubmitReasoning}
                    disabled={!reasoning || isSubmitting}
                    className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xl shadow-blue-100"
                  >
                    {isSubmitting ? 'Analyzing...' : isStaticMode ? 'Show Ideal Solution' : 'Submit for Review'}
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Student's Original Reasoning */}
              <div className="p-8 rounded-3xl border border-gray-100 bg-gray-50/50">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-gray-400">
                  Your Reasoning
                </h4>
                <div className="text-xl leading-relaxed whitespace-pre-wrap font-medium text-gray-700">
                  {reasoning}
                </div>
              </div>

              {/* AI/Ideal Feedback */}
              {feedbackType === 'ai' ? (
                <div className="p-8 rounded-3xl border bg-purple-50 border-purple-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-purple-500">
                    AI Feedback
                  </h4>
                  <div className="text-xl leading-relaxed whitespace-pre-wrap font-medium text-purple-900">
                    {aiFeedback}
                  </div>
                </div>
              ) : (
                <SolutionDisplay 
                  {...parseIdealSolution(aiFeedback || '')} 
                />
              )}
              
              <div className="flex flex-col space-y-4">
                {feedbackType !== 'ai' && (
                  <p className="text-center text-gray-400 text-sm font-medium">
                    Now that you've reviewed the solution, select the correct answer:
                  </p>
                )}
                <div className="grid grid-cols-1 gap-4">
                  {currentQuestion.options.map((option: string) => (
                    <button
                      key={option}
                      onClick={() => setSelectedOption(option)}
                      className={`flex items-center p-6 rounded-2xl border-2 transition-all text-left ${
                        selectedOption === option 
                          ? 'border-blue-600 bg-white shadow-lg' 
                          : 'border-transparent bg-white/50 hover:border-gray-200'
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
              </div>
            </div>
          )}

          {(!modality || modality === 'mcq' || aiFeedback) && (
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
          )}
        </div>

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

export function TestPage() {
  const [searchParams] = useSearchParams();
  const roomParam = searchParams.get('room');
  const gradeParam = parseInt(searchParams.get('grade') || '');
  
  const { roomCode, roomData, loading, error, syncRoom } = useRoom({
    grade: isNaN(gradeParam) ? undefined : gradeParam,
    initialRoomCode: roomParam
  });

  if (loading) return <div className="flex items-center justify-center min-h-screen font-medium text-gray-500">Initializing your room...</div>;
  
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <p className="text-xl text-red-500 font-medium">{error}</p>
      <button onClick={() => window.location.href = '/'} className="text-blue-600 font-bold hover:underline">Return to Selection</button>
    </div>
  );

  if (!roomData || !roomCode) return null;

  return (
    <TestEngine 
      grade={roomData.grade} 
      initialRoomState={roomData} 
      roomCode={roomCode}
      onSync={syncRoom} 
    />
  );
}
