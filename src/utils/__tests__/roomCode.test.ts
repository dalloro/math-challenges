import { describe, it, expect } from 'vitest';
import { generateRoomCode } from '../roomCode';

describe('generateRoomCode', () => {
  it('should generate a code in the format WORD-WORD-NUMBER', () => {
    const code = generateRoomCode();
    // Regex: uppercase letters, hyphen, uppercase letters, hyphen, 2 digits
    expect(code).toMatch(/^[A-Z]+-[A-Z]+-[0-9]{2}$/);
  });

  it('should generate different codes on subsequent calls', () => {
    const code1 = generateRoomCode();
    const code2 = generateRoomCode();
    expect(code1).not.toBe(code2);
  });
});
