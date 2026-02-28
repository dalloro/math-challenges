import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TestPage } from '../pages/TestPage';
import { BrowserRouter } from 'react-router-dom';
import type { Question } from '../hooks/useQuestions';

// Mock dependencies
vi.mock('../firebase', () => ({
  auth: { currentUser: { uid: 'test-user' } },
  db: {},
}));

vi.mock('../services/storage', () => ({
  getApiKey: vi.fn(() => null),
  isAiEnabled: vi.fn(() => true),
  getGlobalSeenQuestions: vi.fn(() => []),
  getTestModality: vi.fn(() => 'combined'),
}));

vi.mock('../hooks/useRoom', () => ({
  useRoom: () => ({
    roomCode: 'TEST-ROOM',
    roomData: { 
      remainingSeconds: 3600, 
      grade: 5, 
      currentLevel: 1, 
      answers: [], 
      score: 0,
      streak: 0,
      currentQuestionId: null
    },
    loading: false,
    error: null,
    syncRoom: vi.fn(),
  }),
}));

vi.mock('../hooks/useSession', () => ({
  useSession: (initialState?: { answers?: unknown[], score?: number, currentQuestionIndex?: number }) => ({
    session: { 
      answers: initialState?.answers || [], 
      score: initialState?.score || 0,
      currentQuestionIndex: initialState?.currentQuestionIndex || 0
    },
    recordAnswer: vi.fn(),
    completeSession: vi.fn(),
  }),
}));

vi.mock('../hooks/useQuestions', () => ({
  useQuestions: () => ({
    questions: [
      { id: '1', question: 'What is 2+2?', options: ['3', '4', '5', '6'], correct_answer: '4', type: 'Arithmetic', level: 1 },
    ],
    loading: false,
  }),
}));

vi.mock('../hooks/useQuestionSelection', () => ({
  useQuestionSelection: vi.fn((questions: Question[]) => ({
    selectQuestion: vi.fn(() => questions[0] || null),
    markAsSeen: vi.fn(),
  })),
}));

describe('TestPage Timer Toggle', () => {
  it('toggles timer visibility when clicked', () => {
    render(
      <BrowserRouter>
        <TestPage />
      </BrowserRouter>
    );

    // Initially should show time (formatted 60:00 for 3600s)
    const timerText = screen.getByText(/60:00/i);
    const timerContainer = timerText.closest('div');
    expect(timerContainer).toBeInTheDocument();

    // Click to hide
    fireEvent.click(timerContainer!);
    expect(screen.queryByText(/60:00/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Show Timer/i)).toBeInTheDocument();

    // Click to show again
    fireEvent.click(screen.getByText(/Show Timer/i).closest('div')!);
    expect(screen.getByText(/60:00/i)).toBeInTheDocument();
    expect(screen.queryByText(/Show Timer/i)).not.toBeInTheDocument();
  });
});
