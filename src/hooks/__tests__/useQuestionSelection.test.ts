import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useQuestionSelection } from '../useQuestionSelection';
import * as storage from '../../services/storage';
import type { Question } from '../useQuestions';

vi.mock('../../services/storage');

const mockQuestions: Question[] = [
  { id: '1', grade: 1, level: 1, type: 'Arithmetic', question: 'Q1', options: [], correct_answer: '', ideal_solution: '', difficulty: 'beginner', failure_modes: {} },
  { id: '2', grade: 1, level: 1, type: 'Arithmetic', question: 'Q2', options: [], correct_answer: '', ideal_solution: '', difficulty: 'beginner', failure_modes: {} },
  { id: '3', grade: 1, level: 1, type: 'Logic', question: 'Q3', options: [], correct_answer: '', ideal_solution: '', difficulty: 'beginner', failure_modes: {} },
  { id: '4', grade: 1, level: 2, type: 'Arithmetic', question: 'Q4', options: [], correct_answer: '', ideal_solution: '', difficulty: 'beginner', failure_modes: {} },
];

describe('useQuestionSelection', () => {
  const roomCode = 'TEST-ROOM';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.getGlobalSeenQuestions).mockReturnValue([]);
  });

  it('should pick a question matching grade, level, and type', () => {
    const { result } = renderHook(() => useQuestionSelection(mockQuestions, roomCode));
    const selection = result.current.selectQuestion({ grade: 1, level: 1, type: 'Arithmetic' });
    
    expect(['1', '2']).toContain(selection?.id);
  });

  it('should exclude seen questions from the primary tier', () => {
    vi.mocked(storage.getGlobalSeenQuestions).mockReturnValue(['1']);
    
    const { result } = renderHook(() => useQuestionSelection(mockQuestions, roomCode));
    const selection = result.current.selectQuestion({ grade: 1, level: 1, type: 'Arithmetic' });
    
    expect(selection?.id).toBe('2');
  });

  it('should fall back to the same level regardless of type if primary tier is exhausted', () => {
    vi.mocked(storage.getGlobalSeenQuestions).mockReturnValue(['1', '2']);
    
    const { result } = renderHook(() => useQuestionSelection(mockQuestions, roomCode));
    // Requesting Arithmetic but both Arithmetic are seen. Should pick Logic (id: 3)
    const selection = result.current.selectQuestion({ grade: 1, level: 1, type: 'Arithmetic' });
    
    expect(selection?.id).toBe('3');
  });

  it('should reset global seen questions for the grade if the entire level pool is exhausted', () => {
    vi.mocked(storage.getGlobalSeenQuestions).mockReturnValue(['1', '2', '3']);
    
    const { result } = renderHook(() => useQuestionSelection(mockQuestions, roomCode));
    const selection = result.current.selectQuestion({ grade: 1, level: 1, type: 'Arithmetic' });
    
    // Should have picked something from 1, 2, or 3 after reset
    expect(['1', '2', '3']).toContain(selection?.id);
    expect(storage.clearGlobalSeenQuestions).toHaveBeenCalledWith(1);
  });

  it('should produce consistent results for the same state/seed', () => {
    const { result } = renderHook(() => useQuestionSelection(mockQuestions, roomCode));
    
    const selection1 = result.current.selectQuestion({ grade: 1, level: 1, type: 'Arithmetic' });
    const selection2 = result.current.selectQuestion({ grade: 1, level: 1, type: 'Arithmetic' });
    
    expect(selection1).toEqual(selection2);
  });
});
