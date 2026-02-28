import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getGlobalSeenQuestions, addSeenQuestion, clearGlobalSeenQuestions } from '../storage';

describe('Global Seen Questions Storage', () => {
  const roomCode = 'TEST-ROOM';
  const grade = 5;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should return an empty array if no questions have been seen', () => {
    expect(getGlobalSeenQuestions(grade)).toEqual([]);
  });

  it('should add and retrieve global seen questions', () => {
    addSeenQuestion(roomCode, 'q1', grade);
    addSeenQuestion(roomCode, 'q2', grade);
    expect(getGlobalSeenQuestions(grade)).toEqual(['q1', 'q2']);
  });

  it('should not add duplicate question IDs', () => {
    addSeenQuestion(roomCode, 'q1', grade);
    addSeenQuestion(roomCode, 'q1', grade);
    expect(getGlobalSeenQuestions(grade)).toEqual(['q1']);
  });

  it('should clear global seen questions for a grade', () => {
    addSeenQuestion(roomCode, 'q1', grade);
    clearGlobalSeenQuestions(grade);
    expect(getGlobalSeenQuestions(grade)).toEqual([]);
  });

  it('should handle multiple grades independently', () => {
    addSeenQuestion(roomCode, 'q1', 1);
    addSeenQuestion(roomCode, 'q2', 2);
    expect(getGlobalSeenQuestions(1)).toEqual(['q1']);
    expect(getGlobalSeenQuestions(2)).toEqual(['q2']);
  });
});
