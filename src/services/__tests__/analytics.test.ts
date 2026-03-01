import { describe, it, expect, vi, beforeEach } from 'vitest';
import { incrementQuestionStats } from '../analytics';
import * as firebaseFirestore from 'firebase/firestore';

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(() => ({ id: 'mock-doc-id' })),
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

  it('should call setDoc with correct increment values', async () => {
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

  it('should not increment total_correct if isCorrect is false', async () => {
    const questionId = 'test-q-2';
    const isCorrect = false;
    const timeSpentMs = 3000;

    await incrementQuestionStats(questionId, isCorrect, timeSpentMs);

    expect(firebaseFirestore.setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        total_attempts: { type: 'increment', value: 1 },
        total_correct: { type: 'increment', value: 0 },
        total_time_ms: { type: 'increment', value: 3000 },
        last_updated: expect.any(Date)
      }),
      { merge: true }
    );
  });
});
