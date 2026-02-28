import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSeenQuestions, addSeenQuestion, clearSeenQuestions } from '../storage';

describe('Seen Questions Storage', () => {
  const roomCode = 'TEST-ROOM';

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should return an empty array if no questions have been seen', () => {
    expect(getSeenQuestions(roomCode)).toEqual([]);
  });

  it('should add and retrieve seen questions', () => {
    addSeenQuestion(roomCode, 'q1');
    addSeenQuestion(roomCode, 'q2');
    expect(getSeenQuestions(roomCode)).toEqual(['q1', 'q2']);
  });

  it('should not add duplicate question IDs', () => {
    addSeenQuestion(roomCode, 'q1');
    addSeenQuestion(roomCode, 'q1');
    expect(getSeenQuestions(roomCode)).toEqual(['q1']);
  });

  it('should clear seen questions for a room', () => {
    addSeenQuestion(roomCode, 'q1');
    clearSeenQuestions(roomCode);
    expect(getSeenQuestions(roomCode)).toEqual([]);
  });

  it('should handle multiple rooms independently', () => {
    addSeenQuestion('ROOM-A', 'q1');
    addSeenQuestion('ROOM-B', 'q2');
    expect(getSeenQuestions('ROOM-A')).toEqual(['q1']);
    expect(getSeenQuestions('ROOM-B')).toEqual(['q2']);
  });
});
