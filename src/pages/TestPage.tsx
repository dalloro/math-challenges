import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuestions } from '../hooks/useQuestions';
import type { Question } from '../hooks/useQuestions';
import { useSession } from '../hooks/useSession';
import { useAdaptiveEngine } from '../hooks/useAdaptiveEngine';
import { evaluateReasoning } from '../services/ai';

const RANKS = [
  'Apprentice',    // Level 1-2
  'Scholar',       // Level 3-4
  'Expert',        // Level 5-6
  'Master',        // Level 7-8
  'Grandmaster'    // Level 9-10
];

type Modality = 'mcq' | 'reasoning';

export function TestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const grade = parseInt(searchParams.get('grade') || '5');
  
  const { questions, loading, error } = useQuestions(grade);
  const { session, recordAnswer } = useSession();
  
  const { currentLevel, theme, handleAnswer } = useAdaptiveEngine(questions);
  
  const [modality, setModality] = useState<Modality>('mcq');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'ai' | 'ideal' | null>(null);
  
  const [timer, setTimer] = useState(3600); // 60 minutes

  const currentRank = RANKS[Math.floor((currentLevel - 1) / 2)];

  const availablePool = useMemo(() => {
    const answeredIds = session.answers.map(a => a.questionId);
    let levelPool = questions.filter(q => q.level === currentLevel && !answeredIds.includes(q.id));
    
    if (levelPool.length === 0 && questions.length > 0) {
      const anyUnanswered = questions.filter(q => !answeredIds.includes(q.id));
      if (anyUnanswered.length > 0) {
        const levels = anyUnanswered.map(q => q.level);
        const closest = levels.reduce((prev, curr) => 
          Math.abs(curr - currentLevel) < Math.abs(prev - currentLevel) ? curr : prev
        );
        levelPool = anyUnanswered.filter(q => q.level === closest);
      }
    }
    return levelPool;
  }, [questions, currentLevel, session.answers]);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

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
    recordAnswer(currentQuestion.id, selectedOption, isCorrect);
    handleAnswer(isCorrect);

    setSelectedOption(null);
    setCurrentQuestion(null);
    setReasoning('');
    setModality('mcq');
    setAiFeedback(null);
    setFeedbackType(null);
  };

  const handleSubmitReasoning = async () => {
    if (!reasoning || !currentQuestion) return;
    setIsSubmitting(true);
    
    const apiKey = localStorage.getItem('gemini_api_key');
    
    if (apiKey) {
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
        console.error("AI reasoning failed, falling back to ideal solution", err);
        setAiFeedback(currentQuestion.ideal_solution);
        setFeedbackType('ideal');
      }
    } else {
      // Static fallback
      setAiFeedback(currentQuestion.ideal_solution);
      setFeedbackType('ideal');
    }
    
    setIsSubmitting(false);
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
            <div className="flex justify-between items-start">
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
                <textarea
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  placeholder="Explain your reasoning step-by-step..."
                  className="w-full h-64 p-6 rounded-2xl border-2 border-gray-100 focus:border-blue-500 focus:ring-0 outline-none text-xl text-gray-800 placeholder-gray-300 resize-none transition-all bg-gray-50/30"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSubmitReasoning}
                    disabled={!reasoning || isSubmitting}
                    className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xl shadow-blue-100"
                  >
                    {isSubmitting ? 'Analyzing...' : 'Submit for Review'}
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className={`p-8 rounded-3xl border ${
                feedbackType === 'ai' ? 'bg-purple-50 border-purple-100' : 'bg-blue-50 border-blue-100'
              }`}>
                <h4 className={`text-xs font-black uppercase tracking-[0.2em] mb-4 ${
                  feedbackType === 'ai' ? 'text-purple-500' : 'text-blue-500'
                }`}>
                  {feedbackType === 'ai' ? 'AI Feedback' : 'Ideal Solution'}
                </h4>
                <div className={`text-xl leading-relaxed whitespace-pre-wrap font-medium ${
                  feedbackType === 'ai' ? 'text-purple-900' : 'text-blue-900'
                }`}>
                  {aiFeedback}
                </div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <p className="text-center text-gray-400 text-sm font-medium">
                  {feedbackType === 'ai' 
                    ? "Based on the feedback, select your final answer:" 
                    : "Now that you've reviewed the solution, select the correct answer:"}
                </p>
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
