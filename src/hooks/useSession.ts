import { useState, useCallback } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

export interface SessionState {
  currentQuestionIndex: number;
  score: number;
  answers: Array<{
    questionId: string;
    answer: string;
    isCorrect: boolean;
    timestamp: number;
  }>;
  startTime: number;
  isComplete: boolean;
}

export function useSession() {
  const [session, setSession] = useState<SessionState>({
    currentQuestionIndex: 0,
    score: 0,
    answers: [],
    startTime: Date.now(),
    isComplete: false,
  });

  const recordAnswer = useCallback((questionId: string, answer: string, isCorrect: boolean) => {
    setSession(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      answers: [
        ...prev.answers,
        { questionId, answer, isCorrect, timestamp: Date.now() },
      ],
      currentQuestionIndex: prev.currentQuestionIndex + 1,
    }));
  }, []);

  const completeSession = useCallback(async (grade: number) => {
    const endTime = Date.now();
    const durationMinutes = (endTime - session.startTime) / 60000;

    const sessionData = {
      userId: auth.currentUser?.uid || 'anonymous',
      grade,
      score: session.score,
      totalQuestions: session.answers.length,
      durationMinutes,
      completedAt: serverTimestamp(),
      answers: session.answers,
    };

    try {
      await addDoc(collection(db, 'sessions'), sessionData);
      setSession(prev => ({ ...prev, isComplete: true }));
    } catch (err) {
      console.error('Error saving session:', err);
    }
  }, [session]);

  return { session, recordAnswer, completeSession };
}
