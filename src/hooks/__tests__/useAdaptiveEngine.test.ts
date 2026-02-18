import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useAdaptiveEngine } from '../useAdaptiveEngine';
import type { Question } from '../useQuestions';

const mockQuestions: Question[] = [
  { id: '1', level: 1, grade: 1, difficulty: 'gifted', type: 'logic', question: 'L1', options: [], correct_answer: '', ideal_solution: '', failure_modes: {} },
  { id: '2', level: 1, grade: 1, difficulty: 'gifted', type: 'logic', question: 'L1', options: [], correct_answer: '', ideal_solution: '', failure_modes: {} },
  { id: '3', level: 2, grade: 1, difficulty: 'gifted', type: 'logic', question: 'L2', options: [], correct_answer: '', ideal_solution: '', failure_modes: {} }
];

describe('useAdaptiveEngine', () => {
  it('should initialize at level 1', () => {
    const { result } = renderHook(() => useAdaptiveEngine(mockQuestions));
    expect(result.current.currentLevel).toBe(1);
  });

  it('should level up after 2 correct answers if next level exists', () => {
    const { result } = renderHook(() => useAdaptiveEngine(mockQuestions));
    
    act(() => { result.current.handleAnswer(true); });
    expect(result.current.currentLevel).toBe(1);
    
    act(() => { result.current.handleAnswer(true); });
    expect(result.current.currentLevel).toBe(2);
  });

  it('should NOT level up if next level is missing', () => {
    const questionsOnlyL1 = mockQuestions.filter(q => q.level === 1);
    const { result } = renderHook(() => useAdaptiveEngine(questionsOnlyL1));
    
    act(() => { result.current.handleAnswer(true); });
    act(() => { result.current.handleAnswer(true); });
    
    expect(result.current.currentLevel).toBe(1);
  });

  it('should level down after 2 incorrect answers and set theme to focus', () => {
    // Start at level 2
    const { result } = renderHook(() => useAdaptiveEngine(mockQuestions));
    
    // Move to level 2
    act(() => { result.current.handleAnswer(true); });
    act(() => { result.current.handleAnswer(true); });
    expect(result.current.currentLevel).toBe(2);
    expect(result.current.theme).toBe('default');

    // Fail twice
    act(() => { result.current.handleAnswer(false); });
    expect(result.current.currentLevel).toBe(2);
    
    act(() => { result.current.handleAnswer(false); });
    expect(result.current.currentLevel).toBe(1);
    expect(result.current.theme).toBe('focus');
  });

  it('should reset theme to default after a correct answer', () => {
    const { result } = renderHook(() => useAdaptiveEngine(mockQuestions));
    
    // Trigger focus theme
    act(() => { result.current.handleAnswer(false); });
    act(() => { result.current.handleAnswer(false); });
    expect(result.current.theme).toBe('focus');

    // Answer correctly
    act(() => { result.current.handleAnswer(true); });
    expect(result.current.theme).toBe('default');
  });
});
