import { useState, useCallback } from 'react';
import type { Question } from './useQuestions';

export function useAdaptiveEngine(questions: Question[]) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [theme, setTheme] = useState<'default' | 'focus'>('default');

  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      const newStreak = streak >= 0 ? streak + 1 : 1;
      setStreak(newStreak);
      setTheme('default');
      
      // Level Up: 2 consecutive correct, ONLY if questions exist at the next level
      if (newStreak >= 2 && currentLevel < 10) {
        const nextLevelExists = questions.some(q => q.level === currentLevel + 1);
        if (nextLevelExists) {
          setCurrentLevel(prev => prev + 1);
          setStreak(0);
        }
      }
    } else {
      const newStreak = streak <= 0 ? streak - 1 : -1;
      setStreak(newStreak);
      
      // Level Down: 2 consecutive incorrect
      if (newStreak <= -2) {
        setTheme('focus');
        if (currentLevel > 1) {
          const prevLevelExists = questions.some(q => q.level === currentLevel - 1);
          if (prevLevelExists) {
            setCurrentLevel(prev => prev - 1);
          }
        }
        setStreak(0);
      }
    }
  }, [currentLevel, streak, questions]);

  return {
    currentLevel,
    streak,
    theme,
    handleAnswer,
    setTheme
  };
}
