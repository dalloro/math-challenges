import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminAnalytics } from '../components/AdminAnalytics';
import * as firebaseFirestore from 'firebase/firestore';

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
global.ResizeObserver = MockResizeObserver as any;

// Mock ResponsiveContainer to avoid width/height warnings in tests
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts') as any;
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: '100%', height: '100%', minWidth: '100px', minHeight: '100px' }}>
        {children}
      </div>
    ),
  };
});

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  getDocs: vi.fn(),
  getFirestore: vi.fn(),
}));

// Mock firebase configuration
vi.mock('../firebase', () => ({
  db: { type: 'mock-db' },
}));

describe('AdminAnalytics Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    vi.mocked(firebaseFirestore.getDocs).mockReturnValue(new Promise(() => {}));
    render(<AdminAnalytics />);
    expect(screen.getByText(/Loading analytics data/i)).toBeInTheDocument();
  });

  it('should render charts after data is loaded', async () => {
    // Mock questions
    const mockQuestions = [
      { id: 'q1', grade: 5, level: 1, type: 'Arithmetic' },
      { id: 'q2', grade: 5, level: 1, type: 'Geometry' },
    ];
    
    // Mock stats
    const mockStats = [
      { id: 'q1', total_attempts: 10, total_correct: 8, total_time_ms: 50000 },
    ];

    // Mock daily stats
    const mockDailyStats = [
      { id: 'ds1', questionId: 'q1', date: '2026-02-28', attempts: 5, correct: 4, time_ms: 25000 }
    ];

    vi.mocked(firebaseFirestore.getDocs)
      .mockResolvedValueOnce({
        docs: mockQuestions.map(q => ({ id: q.id, data: () => q }))
      } as any)
      .mockResolvedValueOnce({
        docs: mockStats.map(s => ({ id: s.id, data: () => s }))
      } as any)
      .mockResolvedValueOnce({
        docs: mockDailyStats.map(ds => ({ id: ds.id, data: () => ds }))
      } as any);

    render(<AdminAnalytics />);

    await waitFor(() => {
      expect(screen.getByText(/Global Performance Distribution/i)).toBeInTheDocument();
      expect(screen.getByText(/Historical Performance Trends/i)).toBeInTheDocument();
      expect(screen.getByText(/Cohort Composition/i)).toBeInTheDocument();
      expect(screen.getByText(/Calibration Summary/i)).toBeInTheDocument();
    });
  });
});
