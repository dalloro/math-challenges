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
  getApiKey: vi.fn(() => null), // Force static mode
  getTestModality: vi.fn(() => 'combined'),
  isAiEnabled: vi.fn(() => true),
  getGlobalSeenQuestions: vi.fn(() => []),
  addSeenQuestion: vi.fn(),
  clearGlobalSeenQuestions: vi.fn(),
}));

vi.mock('../services/analytics');

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

const mockQuestion = { 
  id: '1', 
  question: 'What is 2+2?', 
  options: ['3', '4', '5', '6'], 
  correct_answer: '4', 
  type: 'Arithmetic', 
  level: 1,
  ideal_solution: 'The answer is 4. Socratic Hint: Count on your fingers.'
};

vi.mock('../hooks/useQuestions', () => ({
  useQuestions: () => ({
    questions: [mockQuestion],
    loading: false,
  }),
}));

vi.mock('../hooks/useQuestionSelection', () => ({
  useQuestionSelection: vi.fn((questions: Question[]) => ({
    selectQuestion: vi.fn(() => questions[0] || null),
    markAsSeen: vi.fn(),
  })),
}));

describe('TestPage Integration - Socratic Hint', () => {
  it('displays Socratic Hint and collapsible Ideal Solution in static mode', async () => {
    render(
      <BrowserRouter>
        <TestPage />
      </BrowserRouter>
    );

    // Select an option
    const option = screen.getByText('4');
    fireEvent.click(option);

    // Enter some reasoning
    const textarea = screen.getByPlaceholderText(/Explain your reasoning/i);
    fireEvent.change(textarea, { target: { value: 'I think it is 4.' } });

    // Submit (Show Ideal Solution in static mode)
    const submitBtn = screen.getByText(/Show Ideal Solution/i);
    fireEvent.click(submitBtn);

    // Verify Socratic Hint is visible
    expect(screen.getByText(/Socratic Hint/i)).toBeInTheDocument();
    expect(screen.getByText(/Count on your fingers/i)).toBeInTheDocument();

    // Verify Ideal Solution box is present but collapsed
    // Note: There are now TWO 'Show Ideal Solution' text matches: one was the submit button, one is the collapsible trigger.
    // The collapsible trigger should be the one remaining.
    expect(screen.getByText(/Show Ideal Solution/i)).toBeInTheDocument();
    expect(screen.queryByText(/The answer is 4/i)).not.toBeInTheDocument();

    // Expand Ideal Solution
    const expandBtn = screen.getByText(/Show Ideal Solution/i);
    fireEvent.click(expandBtn);

    // Now it should be visible
    expect(screen.getByText(/The answer is 4/i)).toBeInTheDocument();
  });
});
