import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TestPage } from '../pages/TestPage';
import * as useQuestionsHook from '../hooks/useQuestions';
import * as useSessionHook from '../hooks/useSession';
import * as aiService from '../services/ai';
import { useState } from 'react';

vi.mock('../hooks/useQuestions');
vi.mock('../hooks/useSession');
vi.mock('../services/ai');

const mockQuestion: useQuestionsHook.Question = {
  id: '1',
  level: 1,
  grade: 1,
  difficulty: 'gifted',
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

// Manual mock for localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Open Reasoning UI & Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useQuestionsHook.useQuestions).mockReturnValue({
      questions: [mockQuestion],
      loading: false,
      error: null
    });
    vi.mocked(useSessionHook.useSession).mockImplementation(StatefulSessionMock);
    window.localStorage.clear();
  });

  it('should call AI service if API key is present', async () => {
    window.localStorage.setItem('gemini_api_key', 'real-key');
    vi.mocked(aiService.evaluateReasoning).mockResolvedValue('AI Response');

    render(
      <MemoryRouter initialEntries={['/test?grade=1']}>
        <Routes>
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Switch to Reasoning/i));
    fireEvent.change(screen.getByPlaceholderText(/Explain your reasoning/i), { target: { value: 'My logic' } });
    fireEvent.click(screen.getByText(/Submit for Review/i));

    await waitFor(() => {
      expect(aiService.evaluateReasoning).toHaveBeenCalledWith(
        mockQuestion.question,
        'My logic',
        mockQuestion.ideal_solution,
        'real-key'
      );
      expect(screen.getByText('AI Response')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should fallback to Ideal Solution if API key is missing (Graceful Static Mode)', async () => {
    // No API key in localStorage
    
    render(
      <MemoryRouter initialEntries={['/test?grade=1']}>
        <Routes>
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Switch to Reasoning/i));
    fireEvent.change(screen.getByPlaceholderText(/Explain your reasoning/i), { target: { value: 'My logic' } });
    fireEvent.click(screen.getByText(/Submit for Review/i));

    await waitFor(() => {
      expect(aiService.evaluateReasoning).not.toHaveBeenCalled();
      // Use AllBy to handle multiple matching elements
      const elements = screen.getAllByText(/Ideal Solution/i);
      expect(elements.length).toBeGreaterThan(0);
      expect(screen.getByText('Ideal Solution Content')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should display error if API key is present but service fails (Config Mistake)', async () => {
    window.localStorage.setItem('gemini_api_key', 'wrong-key');
    vi.mocked(aiService.evaluateReasoning).mockRejectedValue(new Error('API Down'));

    render(
      <MemoryRouter initialEntries={['/test?grade=1']}>
        <Routes>
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Switch to Reasoning/i));
    fireEvent.change(screen.getByPlaceholderText(/Explain your reasoning/i), { target: { value: 'My logic' } });
    fireEvent.click(screen.getByText(/Submit for Review/i));

    await waitFor(() => {
      expect(screen.getByText(/AI Configuration Error/i)).toBeInTheDocument();
      // Should NOT show ideal solution here (it's hidden in case of error)
      expect(screen.queryByText(/Ideal Solution Content/i)).not.toBeInTheDocument();
    });
  });
});
