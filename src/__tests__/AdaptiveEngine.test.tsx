import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TestPage } from '../pages/TestPage';
import * as useQuestionsHook from '../hooks/useQuestions';
import * as useSessionHook from '../hooks/useSession';
import * as useRoomHook from '../hooks/useRoom';
import * as storage from '../services/storage';
import { useState, useCallback } from 'react';
import { FieldValue } from 'firebase/firestore';

// Mock the hooks
vi.mock('../hooks/useQuestions');
vi.mock('../hooks/useSession');
vi.mock('../hooks/useRoom');
vi.mock('../services/storage', () => ({
  getApiKey: vi.fn(),
  getTestModality: vi.fn(() => 'combined'),
  saveTestModality: vi.fn(),
  isAiEnabled: vi.fn(() => true),
  getGlobalSeenQuestions: vi.fn(() => []),
  addSeenQuestion: vi.fn(),
  clearGlobalSeenQuestions: vi.fn(),
}));

let mockSelectionIndex = 0;
vi.mock('../hooks/useQuestionSelection', () => ({
  useQuestionSelection: vi.fn((questions: useQuestionsHook.Question[]) => ({
    selectQuestion: vi.fn(({ level }: { level: number }) => {
      const pool = questions.filter((q: useQuestionsHook.Question) => q.level === level);
      const picked = pool[mockSelectionIndex % pool.length] || questions[0] || null;
      mockSelectionIndex++;
      return picked;
    }),
    markAsSeen: vi.fn(),
  })),
}));

const mockQuestions: useQuestionsHook.Question[] = [
  { id: '1', level: 1, grade: 1, difficulty: 'beginner', type: 'logic', question: 'Q1 L1', options: ['A'], correct_answer: 'A', ideal_solution: 'Solution 1', failure_modes: {} },
  { id: '2', level: 1, grade: 1, difficulty: 'beginner', type: 'logic', question: 'Q2 L1', options: ['A'], correct_answer: 'A', ideal_solution: 'Solution 2', failure_modes: {} },
  { id: '3', level: 1, grade: 1, difficulty: 'beginner', type: 'logic', question: 'Q3 L1', options: ['A'], correct_answer: 'A', ideal_solution: 'Solution 3', failure_modes: {} }
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
    vi.mocked(storage.getTestModality).mockReturnValue('combined');
    vi.mocked(storage.getApiKey).mockReturnValue(null);
    vi.mocked(storage.isAiEnabled).mockReturnValue(true);
    vi.mocked(useRoomHook.useRoom).mockReturnValue({
      roomCode: 'TEST01',
      roomData: {
        roomCode: 'TEST01',
        grade: 1,
        currentLevel: 1,
        streak: 0,
        currentQuestionId: null,
        score: 0,
        answers: [],
        remainingSeconds: 3600,
        lastInteractionAt: Date.now(),
        createdAt: {} as unknown as FieldValue
      },
      loading: false,
      error: null,
      syncRoom: vi.fn()
    });
  });

  async function submitQuestion() {
    // 1. Select option
    fireEvent.click(screen.getByText('A'));
    // 2. Type reasoning
    fireEvent.change(screen.getByPlaceholderText(/Explain your reasoning/i), { target: { value: 'My reasoning' } });
    // 3. Submit for review
    fireEvent.click(screen.getByText(/Show Ideal Solution/i));

    // 4. Confirm selection (which now appears in the feedback view)
    // Delay is 0 in test mode
    const nextBtn = await screen.findByText(/Continue to Next Challenge/i);
    fireEvent.click(nextBtn);
  }

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

    // Initial question
    const q1 = await screen.findByText(/Q\d L1/);
    await submitQuestion();

    // Wait for the NEXT question
    await waitFor(() => {
      const q2 = screen.getByText(/Q\d L1/);
      expect(q2.textContent).not.toBe(q1.textContent);
    });

    // Answer second question correctly
    await submitQuestion();

    // Wait for the THIRD question
    await waitFor(() => {
      const q3 = screen.getByText(/Q\d L1/);
      expect(q3).toBeInTheDocument();
    });

    // The level should still be 1
    expect(screen.getByText(/Level 1 \/ 10/i)).toBeInTheDocument();
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
