import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = {
  projectId: "math-challenges-gifted-99",
  apiKey: "AIzaSyBGAlV-Vk4hR8WKIyoqnj_Z3W1rKmE3x8A",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const args = process.argv.slice(2);
  const fileName = args.find(arg => arg.endsWith('.json'));
  const isAppend = args.includes('--append');
  const isCleanOnly = args.includes('--clean');

  if (!fileName || !fs.existsSync(fileName)) {
    console.error(`Usage: npx tsx scripts/seed_simple.ts <filename.json> [--append | --clean]`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(fileName, "utf8"));
  if (data.length === 0) {
    console.log("No data found in file.");
    return;
  }

  const grade = data[0].grade;
  console.log(`Targeting Grade ${grade} (Mode: ${isAppend ? 'Append' : isCleanOnly ? 'Clean Only' : 'Refresh'})...`);

  // Deletion Phase (unless --append is used)
  if (!isAppend) {
    const q = query(collection(db, "questions"), where("grade", "==", grade));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.size > 0) {
      console.log(`Deleting ${querySnapshot.size} existing questions for Grade ${grade}...`);
      for (const d of querySnapshot.docs) {
        await deleteDoc(doc(db, "questions", d.id));
      }
    } else {
      console.log(`No existing questions found for Grade ${grade}.`);
    }
  }

  // Seeding Phase (unless --clean is used)
  if (!isCleanOnly) {
    console.log(`Seeding ${data.length} questions...`);
    for (const item of data) {
      await addDoc(collection(db, "questions"), item);
      console.log("Added question: " + item.question.substring(0, 30) + "...");
    }
  }

  console.log("Done!");
}

run().catch(console.error);
