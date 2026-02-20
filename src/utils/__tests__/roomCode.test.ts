import { describe, it, expect } from 'vitest';
import { generateRoomCode } from '../roomCode';

describe('generateRoomCode', () => {
  it('should generate a 6-character string', () => {
    const code = generateRoomCode();
    expect(code).toHaveLength(6);
  });

  it('should only contain uppercase letters and numbers', () => {
    const code = generateRoomCode();
    expect(code).toMatch(/^[A-Z0-9]{6}$/);
  });

  it('should generate different codes on subsequent calls', () => {
    const code1 = generateRoomCode();
    const code2 = generateRoomCode();
    expect(code1).not.toBe(code2);
  });
});
