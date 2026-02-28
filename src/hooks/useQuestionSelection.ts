import { useCallback } from 'react';
import type { Question } from './useQuestions';
import { getGlobalSeenQuestions, addSeenQuestion, clearGlobalSeenQuestions } from '../services/storage';
import { seededShuffle } from '../utils/randomization';

export interface SelectionCriteria {
  grade: number;
  level: number;
  type: string;
}

export function useQuestionSelection(questions: Question[], roomCode: string) {
  /**
   * Selects a question based on multi-tier logic and robust randomization.
   */
  const selectQuestion = useCallback((criteria: SelectionCriteria): Question | null => {
    if (questions.length === 0) return null;

    // Use Global Seen IDs to prevent repeats across "New Test" starts on the same device
    const seenIds = getGlobalSeenQuestions(criteria.grade);

    // Helper to get available questions in a pool
    const getAvailable = (pool: Question[]) => pool.filter(q => !seenIds.includes(q.id));

    // Tier 1: Match Grade + Level + Type
    const tier1Pool = questions.filter(q => 
      q.grade === criteria.grade && 
      q.level === criteria.level && 
      q.type === criteria.type
    );
    let available = getAvailable(tier1Pool);

    // Tier 2: Fallback to Grade + Level (Any Type)
    if (available.length === 0) {
      const tier2Pool = questions.filter(q => 
        q.grade === criteria.grade && 
        q.level === criteria.level
      );
      available = getAvailable(tier2Pool);

      // Tier 3: Exhausted! Reset global seen list for this grade and try Tier 2 again
      if (available.length === 0 && tier2Pool.length > 0) {
        clearGlobalSeenQuestions(criteria.grade);
        available = tier2Pool;
      }
    }

    if (available.length === 0) return null;

    // Robust Randomization: Use a seed based on roomCode + current progress
    // This ensures that for a specific room attempt, the sequence is stable
    const seed = `${roomCode}-${seenIds.length}`;
    const shuffled = seededShuffle(available, seed);
    
    return shuffled[0];
  }, [questions, roomCode]);

  /**
   * Marks a question as seen.
   */
  const markAsSeen = useCallback((questionId: string, grade: number) => {
    addSeenQuestion(roomCode, questionId, grade);
  }, [roomCode]);

  return { selectQuestion, markAsSeen };
}
