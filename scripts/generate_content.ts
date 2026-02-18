import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const schema = {
  description: "A list of math challenge questions",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      grade: { type: SchemaType.NUMBER },
      level: { type: SchemaType.NUMBER },
      difficulty: { type: SchemaType.STRING },
      type: { type: SchemaType.STRING },
      question: { type: SchemaType.STRING },
      options: { 
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        minItems: 5,
        maxItems: 5
      },
      correct_answer: { type: SchemaType.STRING },
      ideal_solution: { type: SchemaType.STRING },
      failure_modes: {
        type: SchemaType.OBJECT,
        additionalProperties: { type: SchemaType.STRING }
      }
    },
    required: ["grade", "level", "difficulty", "type", "question", "options", "correct_answer", "ideal_solution", "failure_modes"]
  }
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

async function generateBatch(grade: number, level: number, count: number) {
  const prompt = `Generate ${count} "gifted-level" mathematics challenge questions for Grade ${grade} at Difficulty Level ${level} out of 10. 
  
  Difficulty Calibration:
  - Level 1-2 (Apprentice): Foundations of gifted logic, requiring clear but multi-step reasoning.
  - Level 3-5 (Scholar): Intermediate synthesis, requiring spatial visualization or multiple branches of logic.
  - Level 6-8 (Master): Complex reasoning, involving advanced number theory or geometry with subtle traps.
  - Level 9-10 (Grandmaster): Extreme difficulty, requires deep creative synthesis and avoids standard "plug-and-chug" solutions.
  
  Requirements:
  1. Grade: ${grade}
  2. Level: ${level}
  3. Difficulty: Always "gifted"
  4. Type: Rotate between logic, geometry, number theory, and algebraic thinking.
  5. Options: Exactly 5 distinct choices (MC5).
  6. Correct Answer: Must exactly match one of the options.
  7. Ideal Solution: A step-by-step Socratic walkthrough explaining the logical path.
  8. Failure Modes: Identify 2-3 logical traps and provide a supportive hint for each.`;

  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error(`Error generating batch for Grade ${grade} Level ${level}:`, error);
    return [];
  }
}

async function run(grade: number, totalTarget: number) {
  const outputDir = path.join(process.cwd(), 'content_bank');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const filePath = path.join(outputDir, `grade_${grade}.json`);
  let existingData: any[] = [];
  
  if (fs.existsSync(filePath)) {
    existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  const targetPerLevel = Math.ceil(totalTarget / 10);
  console.log(`Starting generation for Grade ${grade}. Total Target: ${totalTarget} (${targetPerLevel} per level).`);

  for (let level = 1; level <= 10; level++) {
    const currentLevelCount = existingData.filter(q => q.level === level).length;
    
    while (existingData.filter(q => q.level === level).length < targetPerLevel) {
      const remainingForLevel = targetPerLevel - existingData.filter(q => q.level === level).length;
      const batchSize = Math.min(5, remainingForLevel);
      
      console.log(`Level ${level}: Generating batch of ${batchSize}... (${existingData.filter(q => q.level === level).length}/${targetPerLevel})`);
      
      const batch = await generateBatch(grade, level, batchSize);
      existingData.push(...batch);
      
      fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  console.log(`Generation complete for Grade ${grade}.`);
}

const grade = parseInt(process.argv[2]) || 5;
const target = parseInt(process.argv[3]) || 50;

if (!process.env.GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env file");
  process.exit(1);
}

run(grade, target).catch(console.error);
