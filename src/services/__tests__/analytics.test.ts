import { describe, it, expect, vi, beforeEach } from 'vitest';
import { incrementQuestionStats, incrementDailyStats } from '../analytics';
import * as firebaseFirestore from 'firebase/firestore';

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn((_db, coll, id) => ({ id, collection: coll })),
  updateDoc: vi.fn(),
  setDoc: vi.fn(),
  increment: vi.fn((n) => ({ type: 'increment', value: n })),
  getFirestore: vi.fn(),
}));

// Mock firebase configuration
vi.mock('../../firebase', () => ({
  db: { type: 'mock-db' },
}));

describe('Analytics Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call setDoc with correct increment values for question stats', async () => {
    const questionId = 'test-q-1';
    const isCorrect = true;
    const timeSpentMs = 5000;

    await incrementQuestionStats(questionId, isCorrect, timeSpentMs);

    expect(firebaseFirestore.doc).toHaveBeenCalledWith({ type: 'mock-db' }, 'question_stats', questionId);
    expect(firebaseFirestore.setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        total_attempts: { type: 'increment', value: 1 },
        total_correct: { type: 'increment', value: 1 },
        total_time_ms: { type: 'increment', value: 5000 },
        last_updated: expect.any(Date)
      }),
      { merge: true }
    );
  });

  describe('incrementDailyStats', () => {
    it('should call setDoc with date-specific document ID', async () => {
      const questionId = 'test-q-daily';
      const isCorrect = true;
      const timeSpentMs = 10000;
      
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const expectedDocId = `${questionId}_${today}`;

      await incrementDailyStats(questionId, isCorrect, timeSpentMs);

      expect(firebaseFirestore.doc).toHaveBeenCalledWith(
        { type: 'mock-db' }, 
        'question_daily_stats', 
        expectedDocId
      );
      
      expect(firebaseFirestore.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          attempts: { type: 'increment', value: 1 },
          correct: { type: 'increment', value: 1 },
          time_ms: { type: 'increment', value: 10000 },
          date: today
        }),
        { merge: true }
      );
    });
  });
});
