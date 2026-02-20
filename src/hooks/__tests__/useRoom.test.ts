import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRoom } from '../useRoom';
import * as firebaseFirestore from 'firebase/firestore';

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
  getFirestore: vi.fn(),
  serverTimestamp: vi.fn(() => 'mock-timestamp'),
}));

// Mock firebase configuration
vi.mock('../../firebase', () => ({
  db: {},
  auth: { currentUser: { uid: 'test-user' } }
}));

describe('useRoom Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it('should generate a new room code if none is provided', async () => {
    const { result } = renderHook(() => useRoom({ grade: 5 }));
    
    await waitFor(() => {
      expect(result.current.roomCode).toMatch(/^[A-Z]+-[A-Z]+-[0-9]{2}$/);
    });
    
    expect(window.localStorage.getItem('math_challenge_room_code')).toBe(result.current.roomCode);
  });

  it('should load an existing room from localStorage', async () => {
    const existingCode = 'ABC123';
    window.localStorage.setItem('math_challenge_room_code', existingCode);
    
    vi.mocked(firebaseFirestore.getDoc).mockResolvedValue({
      exists: () => true,
      data: () => ({
        roomCode: existingCode,
        grade: 5,
        currentLevel: 1,
        score: 0,
        answers: [],
        remainingSeconds: 3600,
        lastInteractionAt: Date.now(),
      })
    } as any);

    const { result } = renderHook(() => useRoom({ grade: 5 }));
    
    await waitFor(() => {
      expect(result.current.roomCode).toBe(existingCode);
    });
  });

  it('should recover timer correctly based on last interaction', async () => {
    const existingCode = 'TIMER1';
    const now = Date.now();
    const tenMinutesAgo = now - (10 * 60 * 1000);
    const storedRemaining = 3600; // 60 mins
    
    vi.mocked(firebaseFirestore.getDoc).mockResolvedValue({
      exists: () => true,
      data: () => ({
        roomCode: existingCode,
        grade: 5,
        remainingSeconds: storedRemaining,
        lastInteractionAt: tenMinutesAgo,
      })
    } as any);

    const { result } = renderHook(() => useRoom({ initialRoomCode: existingCode }));
    
    await waitFor(() => {
      expect(result.current.roomData).not.toBeNull();
    });

    expect(result.current.roomData?.remainingSeconds).toBeLessThanOrEqual(3000);
    expect(result.current.roomData?.remainingSeconds).toBeGreaterThan(2990);
  });
});
