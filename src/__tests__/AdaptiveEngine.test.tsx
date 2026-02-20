import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TestPage } from '../pages/TestPage';
import * as useQuestionsHook from '../hooks/useQuestions';
import * as useSessionHook from '../hooks/useSession';
import * as useRoomHook from '../hooks/useRoom';
import { useState, useCallback } from 'react';

// Mock the hooks
vi.mock('../hooks/useQuestions');
vi.mock('../hooks/useSession');
vi.mock('../hooks/useRoom');

const mockQuestions: useQuestionsHook.Question[] = [
  { id: '1', level: 1, grade: 1, difficulty: 'gifted', type: 'logic', question: 'Q1 L1', options: ['A'], correct_answer: 'A', ideal_solution: '', failure_modes: {} },
  { id: '2', level: 1, grade: 1, difficulty: 'gifted', type: 'logic', question: 'Q2 L1', options: ['A'], correct_answer: 'A', ideal_solution: '', failure_modes: {} },
  { id: '3', level: 1, grade: 1, difficulty: 'gifted', type: 'logic', question: 'Q3 L1', options: ['A'], correct_answer: 'A', ideal_solution: '', failure_modes: {} }
];

function StatefulSessionMock() {
  const [session, setSession] = useState<useSessionHook.SessionState>({
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

  return { session, recordAnswer, completeSession: vi.fn() };
}

describe('Adaptive Engine Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRoomHook.useRoom).mockReturnValue({
      roomCode: 'TEST01',
      roomData: {
        roomCode: 'TEST01',
        grade: 1,
        currentLevel: 1,
        score: 0,
        answers: [],
        remainingSeconds: 3600,
        lastInteractionAt: Date.now(),
        createdAt: {}
      },
      loading: false,
      error: null,
      syncRoom: vi.fn()
    });
  });

  it('should stay at level 1 if level 2 questions do not exist', async () => {
    vi.mocked(useQuestionsHook.useQuestions).mockReturnValue({
      questions: mockQuestions,
      loading: false,
      error: null
    });

    vi.mocked(useSessionHook.useSession).mockImplementation(StatefulSessionMock);

    render(
      <MemoryRouter initialEntries={['/test?grade=1']}>
        <Routes>
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Initial question (randomized, but we know it's one of the 3)
    const q1 = await screen.findByText(/Q\d L1/);
    fireEvent.click(screen.getByText('A'));
    fireEvent.click(screen.getByText(/Confirm Selection/i));

    // Wait for the NEXT question (should be one of the remaining two)
    await waitFor(() => {
      const q2 = screen.getByText(/Q\d L1/);
      expect(q2.textContent).not.toBe(q1.textContent);
    });
    
    // Answer second question correctly (Streak = 2)
    fireEvent.click(screen.getByText('A'));
    fireEvent.click(screen.getByText(/Confirm Selection/i));

    // Wait for the THIRD question
    await waitFor(() => {
      const q3 = screen.getByText(/Q\d L1/);
      expect(q3).toBeInTheDocument();
    });

    // The level should still be 1 because Level 2 doesn't exist in questions array
    expect(screen.getByText(/Level 1 \/ 10/i)).toBeInTheDocument();
    expect(screen.queryByText(/Level 2 \/ 10/i)).not.toBeInTheDocument();
  });

  it('should correctly display question level from metadata', async () => {
    const questionsWithMixedLevels: useQuestionsHook.Question[] = [
      { ...mockQuestions[0], level: 5, question: 'Mixed Q1' }
    ];

    vi.mocked(useQuestionsHook.useQuestions).mockReturnValue({
      questions: questionsWithMixedLevels,
      loading: false,
      error: null
    });

    vi.mocked(useSessionHook.useSession).mockImplementation(StatefulSessionMock);

    render(
      <MemoryRouter initialEntries={['/test?grade=1']}>
        <Routes>
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Level 5 \/ 10/i)).toBeInTheDocument();
  });
});
