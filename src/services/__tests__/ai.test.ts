import { describe, it, expect, vi } from 'vitest';
import { evaluateReasoning } from '../ai';

// Mock the Gemini SDK
vi.mock('@google/generative-ai', () => {
  const generateContentMock = vi.fn().mockResolvedValue({
    response: {
      text: () => 'Socratic feedback hint.'
    }
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
  it('should return a Socratic hint when reasoning is provided', async () => {
    const feedback = await evaluateReasoning('Q', 'Input', 'Solution', 'fake-key');
    expect(feedback).toBe('Socratic feedback hint.');
  });

  it('should throw error if API key is missing', async () => {
    await expect(evaluateReasoning('Q', 'Input', 'Solution', ''))
      .rejects.toThrow('API Key is required');
  });
});
