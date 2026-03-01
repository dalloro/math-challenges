import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TestPage } from '../pages/TestPage';
import { BrowserRouter } from 'react-router-dom';
import * as storage from '../services/storage';
import * as useQuestionsHook from '../hooks/useQuestions';
import * as useRoomHook from '../hooks/useRoom';
import { FieldValue } from 'firebase/firestore';

// Mock dependencies
vi.mock('../services/storage');
vi.mock('../hooks/useQuestions');
vi.mock('../hooks/useRoom');
vi.mock('../services/ai');
vi.mock('../hooks/useQuestionSelection', () => ({
  useQuestionSelection: vi.fn((questions: useQuestionsHook.Question[]) => ({
    selectQuestion: vi.fn(() => questions[0] || null),
    markAsSeen: vi.fn(),
  })),
}));

const mockQuestion: useQuestionsHook.Question = {
  id: 'q1',
  grade: 5,
  question: 'What is 2+2?',
  options: ['3', '4', '5'],
  correct_answer: '4',
  level: 1,
  difficulty: 'beginner',
  type: 'Arithmetic',
  ideal_solution: 'Step 1: Add 2 and 2. Result is 4.',
  failure_modes: {}
};

describe('Blind Mode & Mandatory Reasoning', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.getSeenQuestions).mockReturnValue([]);
    
    // Mock useRoom
    vi.mocked(useRoomHook.useRoom).mockReturnValue({
      roomCode: 'TEST-ROOM',
      roomData: { 
        roomCode: 'TEST-ROOM',
        grade: 5, 
        answers: [], 
        score: 0, 
        currentLevel: 1, 
        streak: 0, 
        remainingSeconds: 3600,
        currentQuestionId: null,
        lastInteractionAt: Date.now(),
        createdAt: {} as unknown as FieldValue
      },
      loading: false,
      error: null,
      syncRoom: vi.fn()
    });

    // Mock useQuestions
    vi.mocked(useQuestionsHook.useQuestions).mockReturnValue({
      questions: [mockQuestion],
      loading: false,
      error: null
    });
  });

  it('should hide multiple choice options in Blind Mode', () => {
    vi.mocked(storage.getTestModality).mockReturnValue('blind');
    
    render(
      <BrowserRouter>
        <TestPage />
      </BrowserRouter>
    );

    // Options should NOT be visible
    expect(screen.queryByText('3')).toBeNull();
    expect(screen.queryByText('4')).toBeNull();
    
    // Final Answer input SHOULD be visible
    expect(screen.getByPlaceholderText(/Enter your final answer/i)).toBeDefined();
  });

  it('should show validation message if reasoning is empty on submit', async () => {
    vi.mocked(storage.getTestModality).mockReturnValue('combined');
    
    render(
      <BrowserRouter>
        <TestPage />
      </BrowserRouter>
    );

    const submitBtn = screen.getByText(/Show Ideal Solution/i); // Assuming no API key for this test
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Please provide your reasoning/i)).toBeDefined();
  });

  it('should allow submission when reasoning is provided', async () => {
    vi.mocked(storage.getTestModality).mockReturnValue('combined');
    vi.mocked(storage.getApiKey).mockReturnValue(null); // Static mode
    
    render(
      <BrowserRouter>
        <TestPage />
      </BrowserRouter>
    );

    const textarea = screen.getByPlaceholderText(/Explain your reasoning/i);
    fireEvent.change(textarea, { target: { value: 'This is my reasoning.' } });
    
    const option = screen.getByText('4');
    fireEvent.click(option);

    const submitBtn = screen.getByText(/Show Ideal Solution/i);
    fireEvent.click(submitBtn);

    // Should now show feedback
    expect((await screen.findAllByText(/Your Reasoning/i)).length).toBeGreaterThan(0);
  });
});
