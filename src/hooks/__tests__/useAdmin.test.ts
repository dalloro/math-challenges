import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAdmin } from '../useAdmin';
import { onAuthStateChanged } from 'firebase/auth';

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
  getAuth: vi.fn(),
}));

vi.mock('../firebase', () => ({
  auth: {},
}));

describe('useAdmin Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return isAdmin: false when user is not logged in', async () => {
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback: any) => {
      callback(null);
      return () => {};
    });

    const { result } = renderHook(() => useAdmin());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.isAdmin).toBe(false);
  });

  it('should return isAdmin: true when user has admin claim', async () => {
    const mockUser = {
      getIdTokenResult: vi.fn().mockResolvedValue({
        claims: { admin: true }
      })
    };

    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback: any) => {
      callback(mockUser);
      return () => {};
    });

    const { result } = renderHook(() => useAdmin());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.isAdmin).toBe(true);
  });

  it('should return isAdmin: false when user does not have admin claim', async () => {
    const mockUser = {
      getIdTokenResult: vi.fn().mockResolvedValue({
        claims: { admin: false }
      })
    };

    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback: any) => {
      callback(mockUser);
      return () => {};
    });

    const { result } = renderHook(() => useAdmin());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.isAdmin).toBe(false);
  });
});
