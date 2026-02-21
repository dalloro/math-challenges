import { GoogleGenerativeAI } from "@google/generative-ai";

export async function evaluateReasoning(
  question: string,
  studentInput: string,
  idealSolution: string,
  apiKey: string
): Promise<string> {
  if (!apiKey) throw new Error("API Key is required");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `
    You are a Socratic math tutor for gifted students.
    
    Question: ${question}
    Ideal Solution: ${idealSolution}
    Student's Reasoning: ${studentInput}
    
    Task:
    Evaluate the student's reasoning. 
    - If they are on the right track, provide a supportive nudge to the next step.
    - If they have a logical flaw, ask a probing question to help them discover the error themselves.
    - NEVER give the final answer directly.
    - Keep your response concise (2-3 sentences).
    - Be professional but encouraging.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to get AI feedback");
  }
}

/**
 * Validates the Gemini API key by making a simple request to the service.
 * @param apiKey The key to validate.
 * @returns true if valid, throws error otherwise.
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey) throw new Error("API Key is required");

  const genAI = new GoogleGenerativeAI(apiKey);
  // Using a very small prompt to minimize tokens/cost
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  try {
    await model.generateContent("ping");
    return true;
  } catch (error: any) {
    console.error("Gemini Validation Error:", error);
    throw new Error(error.message || "Invalid API Key or connection issue.");
  }
}
