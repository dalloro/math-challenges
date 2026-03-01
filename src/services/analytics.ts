import { db } from '../firebase';
import { doc, setDoc, increment } from 'firebase/firestore';

/**
 * Increments global performance counters for a specific question in Firestore.
 * This is a zero-cost implementation using client-side atomic increments.
 */
export async function incrementQuestionStats(
  questionId: string, 
  isCorrect: boolean, 
  timeSpentMs: number
): Promise<void> {
  const statsRef = doc(db, 'question_stats', questionId);
  
  try {
    await setDoc(statsRef, {
      total_attempts: increment(1),
      total_correct: increment(isCorrect ? 1 : 0),
      total_time_ms: increment(timeSpentMs),
      last_updated: new Date()
    }, { merge: true });
  } catch (error) {
    console.error('Failed to increment question stats:', error);
  }
}

/**
 * Increments daily performance counters for a specific question.
 * Records data in 'question_daily_stats' collection with document IDs as {questionId}_{YYYY-MM-DD}.
 */
export async function incrementDailyStats(
  questionId: string,
  isCorrect: boolean,
  timeSpentMs: number
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const statsRef = doc(db, 'question_daily_stats', `${questionId}_${today}`);

  try {
    await setDoc(statsRef, {
      attempts: increment(1),
      correct: increment(isCorrect ? 1 : 0),
      time_ms: increment(timeSpentMs),
      date: today,
      questionId: questionId
    }, { merge: true });
  } catch (error) {
    console.error('Failed to increment daily stats:', error);
  }
}
