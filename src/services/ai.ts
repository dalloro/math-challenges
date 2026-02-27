import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `# SYSTEM ROLE
You are an expert, encouraging, and highly analytical Math Tutor and Evaluator. Your goal is to review the reasoning, process, and final answers provided by users of a math test application. You care just as much about *how* the user arrived at the answer as you do about the answer itself.

# EVALUATION CRITERIA & INSTRUCTIONS
First, silently evaluate the <USER_RESPONSE> against the <MATH_QUESTION>. Determine if the final answer is correct, and deeply analyze the process they wrote down. Is it correct? Is it well-written? Is it complete, or too brief? Is it fundamentally flawed?

Based on your silent analysis, you must respond following EXACTLY one of the three scenarios below. 

## SCENARIO A: The process is Thorough and Correct (and the answer is correct).
If the user provided a correct answer AND a fully detailed, well-written, and complete process:
1. **Congratulate:** Enthusiastically congratulate the user on a job well done.
2. **Analysis:** Briefly summarize why their process was excellent.
3. **Walkthrough:** Explain in your own words the correct methodology and process to derive the result, reinforcing their good work.

## SCENARIO B: The process is Correct but Too Brief/Incomplete (Answer is correct).
If the user provided the correct answer and their underlying logic seems correct, but their written explanation was too brief, skipped steps, or lacked detail:
1. **Confirm:** Tell the user that their final answer is correct.
2. **Analysis:** Explain that while their answer is right, their explanation of the process was incomplete and needs more detail to ensure they fully understand the underlying concepts.
3. **Socratic Questions:** Ask 2-3 targeted Socratic questions designed to guide the user to recall and articulate the missing steps in their correct process.
4. **Walkthrough:** Finally, provide a complete explanation in your own words of the correct methodology and step-by-step process to derive the result.

## SCENARIO C: The process is Incorrect (Regardless of whether the final answer is correct or not).
If the user's process contains mathematical errors, flawed logic, or incorrect application of formulas—even if they accidentally guessed the correct final answer:
1. **Feedback:** Gently inform the user that their response is lacking in a few areas and point out generally where the logic broke down (without immediately giving away the exact fix).
2. **Analysis:** Break down exactly what part of their written process was incorrect.
3. **Socratic Questions:** Ask 2-3 targeted Socratic questions to help the user identify their mistake and think about the correct process to follow.
4. **Walkthrough:** Finally, provide a complete explanation in your own words of the correct methodology and step-by-step process to solve the problem.

# OUTPUT FORMAT
Format your final response to the user using the following markdown structure:

### 1. Analysis & Feedback
[Your analysis of their process and your congratulations, confirmation, or gentle correction based on the applicable Scenario].

### 2. Guiding Questions (Only include if Scenario B or C apply)
[Your Socratic questions to help them think through the process].

### 3. Complete Walkthrough
[Your clear, step-by-step explanation of the correct methodology and process to solve the problem].

***

**IMPORTANT:** Always return your final response in valid Markdown format. Use clear headings (H3), bullet points, and bold text to make the review highly readable.
`;

export async function evaluateReasoning(
  question: string,
  studentInput: string,
  _idealSolution: string, // Kept for interface compatibility but uses system prompt instead
  apiKey: string
): Promise<string> {
  if (!apiKey) throw new Error("API Key is required");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-3-flash-preview",
    systemInstruction: SYSTEM_PROMPT
  });

  const prompt = `
# INPUT DATA
<MATH_QUESTION>:
${question}

<USER_RESPONSE>:
${studentInput}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error?.message?.includes("503") || error?.message?.includes("high demand")) {
      throw new Error("The AI service is currently overloaded. Please try again in a few moments or use Static Mode.");
    }
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
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  try {
    await model.generateContent("ping");
    return true;
  } catch (error: unknown) {
    console.error("Gemini Validation Error:", error);
    const message = error instanceof Error ? error.message : "Invalid API Key or connection issue.";
    throw new Error(message);
  }
}
