import { db } from '../firebase';
import { doc, setDoc, increment } from 'firebase/firestore';

/**
 * Increments global performance counters for a specific question in Firestore.
 * This is a zero-cost implementation using client-side atomic increments.
 * 
 * @param questionId The unique ID of the question.
 * @param isCorrect Whether the student answered correctly.
 * @param timeSpentMs Time spent on the question in milliseconds.
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
    // Non-blocking failure - we don't want to break the student's test if analytics fail
  }
}
