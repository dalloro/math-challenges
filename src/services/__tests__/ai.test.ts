import { describe, it, expect, vi } from 'vitest';
import { evaluateReasoning, validateApiKey } from '../ai';

// Mock the Gemini SDK
vi.mock('@google/generative-ai', () => {
  const generateContentMock = vi.fn().mockImplementation((prompt) => {
    if (prompt === 'ping') return Promise.resolve({ response: { text: () => 'pong' } });
    return Promise.resolve({
      response: {
        text: () => 'Socratic feedback hint.'
      }
    });
  });

  const getGenerativeModelMock = vi.fn().mockImplementation(() => {
    return {
      generateContent: generateContentMock
    };
  });

  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(function() {
      return {
        getGenerativeModel: getGenerativeModelMock
      };
    })
  };
});

describe('AI Service', () => {
  describe('evaluateReasoning', () => {
    it('should return a Socratic hint when reasoning is provided', async () => {
      const feedback = await evaluateReasoning('Q', 'Input', 'Solution', 'fake-key');
      expect(feedback).toBe('Socratic feedback hint.');
    });

    it('should throw error if API key is missing', async () => {
      await expect(evaluateReasoning('Q', 'Input', 'Solution', ''))
        .rejects.toThrow('API Key is required');
    });
  });

  describe('validateApiKey', () => {
    it('should return true for a valid key', async () => {
      const isValid = await validateApiKey('valid-key');
      expect(isValid).toBe(true);
    });

    it('should throw error if key is empty', async () => {
      await expect(validateApiKey(''))
        .rejects.toThrow('API Key is required');
    });
  });
});
