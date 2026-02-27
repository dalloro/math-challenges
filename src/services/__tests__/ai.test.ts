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

    it('should throw specific error message for 503 high demand', async () => {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI('fake-key');
      const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
      
      vi.mocked(model.generateContent).mockRejectedValueOnce({ message: '503 high demand' });
      
      await expect(evaluateReasoning('Q', 'Input', 'Solution', 'fake-key'))
        .rejects.toThrow(/AI service is currently overloaded/);
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
