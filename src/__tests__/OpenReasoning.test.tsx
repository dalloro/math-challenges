import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TestPage } from '../pages/TestPage';
import * as useQuestionsHook from '../hooks/useQuestions';
import * as useSessionHook from '../hooks/useSession';
import * as useRoomHook from '../hooks/useRoom';
import * as aiService from '../services/ai';
import * as storageService from '../services/storage';
import { useState } from 'react';
import { FieldValue } from 'firebase/firestore';

vi.mock('../hooks/useQuestions');
vi.mock('../hooks/useSession');
vi.mock('../hooks/useRoom');
vi.mock('../services/ai');
vi.mock('../services/storage');

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

describe('Open Reasoning UI & Integration', () => {
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

    window.localStorage.clear();
  });

  it('should call AI service if API key is present', async () => {
    vi.mocked(storageService.getApiKey).mockReturnValue('real-key');
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
    vi.mocked(storageService.getApiKey).mockReturnValue(null);

    render(
      <MemoryRouter initialEntries={['/test?grade=1']}>
        <Routes>
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Static Mode/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Switch to Reasoning/i));
    fireEvent.change(screen.getByPlaceholderText(/Explain your reasoning/i), { target: { value: 'My logic' } });
    fireEvent.click(screen.getByText(/Show Ideal Solution/i));

    // Expand the collapsible solution box (SolutionDisplay)
    const expandBtn = await screen.findByText(/Show Ideal Solution/i);
    fireEvent.click(expandBtn);

    await waitFor(() => {
      expect(aiService.evaluateReasoning).not.toHaveBeenCalled();
      const elements = screen.getAllByText(/Ideal Solution/i);
      expect(elements.length).toBeGreaterThan(0);
      expect(screen.getByText('Ideal Solution Content')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should display error if API key is present but service fails (Config Mistake)', async () => {
    vi.mocked(storageService.getApiKey).mockReturnValue('wrong-key');
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
      expect(screen.queryByText(/Ideal Solution Content/i)).not.toBeInTheDocument();
    });
  });
});
