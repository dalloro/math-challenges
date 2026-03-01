import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TestPage } from '../pages/TestPage';
import * as useQuestionsHook from '../hooks/useQuestions';
import * as useSessionHook from '../hooks/useSession';
import * as useRoomHook from '../hooks/useRoom';
import * as storageService from '../services/storage';
import * as analyticsService from '../services/analytics';
import { useState } from 'react';
import { FieldValue } from 'firebase/firestore';

vi.mock('../hooks/useQuestions');
vi.mock('../hooks/useSession');
vi.mock('../hooks/useRoom');
vi.mock('../services/ai');
vi.mock('../services/analytics');
vi.mock('../hooks/useQuestionSelection', () => ({
  useQuestionSelection: vi.fn((questions: useQuestionsHook.Question[]) => ({
    selectQuestion: vi.fn(() => questions[0] || null),
    markAsSeen: vi.fn(),
  })),
}));
vi.mock('../services/storage', () => ({
  getApiKey: vi.fn(() => null),
  getTestModality: vi.fn(() => 'combined'),
  saveTestModality: vi.fn(),
  isAiEnabled: vi.fn(() => true),
  getGlobalSeenQuestions: vi.fn(() => []),
  addSeenQuestion: vi.fn(),
  clearGlobalSeenQuestions: vi.fn(),
}));

const mockQuestion: useQuestionsHook.Question = {
  id: 'test-q-id',
  level: 1,
  grade: 1,
  difficulty: 'beginner',
  type: 'logic',
  question: 'Logic Question',
  options: ['A', 'B', 'C', 'D', 'E'],
  correct_answer: 'A',
  ideal_solution: 'Ideal Solution Content',
  failure_modes: {}
};

function StatefulSessionMock() {
  const [session] = useState<useSessionHook.SessionState>({
    currentQuestionIndex: 0,
    score: 0,
    answers: [],
    startTime: Date.now(),
    isComplete: false,
  });
  return { session, recordAnswer: vi.fn(), completeSession: vi.fn() };
}

describe('Analytics Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useQuestionsHook.useQuestions).mockReturnValue({
      questions: [mockQuestion],
      loading: false,
      error: null
    });
    vi.mocked(useSessionHook.useSession).mockImplementation(StatefulSessionMock);
    
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

  it('should call incrementQuestionStats when an answer is submitted', async () => {
    render(
      <MemoryRouter initialEntries={['/test?grade=1']}>
        <Routes>
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('A'));
    fireEvent.change(screen.getByPlaceholderText(/Explain your reasoning/i), { target: { value: 'My logic' } });
    fireEvent.click(screen.getByText(/Show Ideal Solution/i));

    await waitFor(() => {
      expect(analyticsService.incrementQuestionStats).toHaveBeenCalledWith(
        'test-q-id',
        true, // 'A' is correct
        expect.any(Number) // timeSpentMs
      );
    });
  });
});
