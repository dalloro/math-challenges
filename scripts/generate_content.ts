import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const PROGRESS_FILE = 'generate_content_ts_progress.json';
const PROMPT_TEMPLATE_PATH = 'CONTENT-GENERATOR-PROMPT.md';

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
  model: "gemini-3-flash-preview",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

function getDifficultyTier(level: number): string {
  if (level <= 2) return "beginner";
  if (level <= 4) return "intermediate";
  if (level <= 6) return "advanced";
  if (level <= 8) return "expert";
  return "master";
}

async function generateBatch(grade: number, level: number, count: number) {
  if (!fs.existsSync(PROMPT_TEMPLATE_PATH)) {
    throw new Error(`Prompt template not found at ${PROMPT_TEMPLATE_PATH}`);
  }

  let prompt = fs.readFileSync(PROMPT_TEMPLATE_PATH, 'utf8');
  prompt = prompt.replace(/{grade}/g, grade.toString())
                 .replace(/{level}/g, level.toString())
                 .replace(/{count}/g, count.toString());

  try {
    const result = await model.generateContent(prompt);
    const questions = JSON.parse(result.response.text());
    
    // Safety check: Ensure difficulty field matches level-based tiers
    return questions.map((q: any) => ({
      ...q,
      difficulty: getDifficultyTier(q.level)
    }));
  } catch (error) {
    console.error(`Error generating batch for Grade ${grade} Level ${level}:`, error);
    return [];
  }
}

interface Progress {
  completed_levels: { grade: number; level: number; count: number }[];
}

function loadProgress(): Progress {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  }
  return { completed_levels: [] };
}

function saveProgress(progress: Progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

async function run(grade: number, totalTarget: number) {
  const outputDir = path.join(process.cwd(), 'seed_content', 'batches');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const progress = loadProgress();
  const targetPerLevel = Math.ceil(totalTarget / 10);
  
  console.log(`Starting generation for Grade ${grade}. Total Target: ${totalTarget} (${targetPerLevel} per level).`);

  for (let level = 1; level <= 10; level++) {
    const levelProgress = progress.completed_levels.find(p => p.grade === grade && p.level === level);
    let currentCount = levelProgress ? levelProgress.count : 0;

    if (currentCount >= targetPerLevel) {
      console.log(`Grade ${grade} Level ${level} already complete (${currentCount}/${targetPerLevel}). Skipping.`);
      continue;
    }

    while (currentCount < targetPerLevel) {
      const remaining = targetPerLevel - currentCount;
      const batchSize = Math.min(50, remaining);
      const batchNum = Math.floor(currentCount / 50);
      const batchFilePath = path.join(outputDir, `grade_${grade}_level_${level}_batch_${batchNum}.json`);

      console.log(`Level ${level}: Generating batch ${batchNum} (size ${batchSize})...`);
      
      const batch = await generateBatch(grade, level, batchSize);
      if (batch.length === 0) {
        console.error("Batch generation failed. Retrying in 5 seconds...");
        await new Promise(resolve => setTimeout(resolve, 5000));
        continue;
      }

      fs.writeFileSync(batchFilePath, JSON.stringify(batch, null, 2));
      
      currentCount += batch.length;
      
      // Update Progress
      const idx = progress.completed_levels.findIndex(p => p.grade === grade && p.level === level);
      if (idx >= 0) {
        progress.completed_levels[idx].count = currentCount;
      } else {
        progress.completed_levels.push({ grade, level, count: currentCount });
      }
      saveProgress(progress);

      console.log(`Level ${level} Progress: ${currentCount}/${targetPerLevel}`);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  console.log(`Generation complete for Grade ${grade}.`);
}

const gradeArg = parseInt(process.argv[2]) || 5;
const targetArg = parseInt(process.argv[3]) || 1000;

if (!process.env.GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env file");
  process.exit(1);
}

run(gradeArg, targetArg).catch(console.error);
