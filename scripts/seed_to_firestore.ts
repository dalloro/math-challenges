import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

// Note: You will need to download your service account key from the Firebase Console
// and save it as 'serviceAccountKey.json' in the root directory to run this script.
const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('Error: serviceAccountKey.json not found.');
  console.log('Please download it from Firebase Console -> Project Settings -> Service Accounts.');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function seedQuestions(filePath: string) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const collectionRef = db.collection('questions');

  let batch = db.batch();
  let count = 0;

  for (const item of data) {
    const docRef = collectionRef.doc(); // Auto-generate ID
    batch.set(docRef, item);
    count++;

    // Firestore batches are limited to 500 operations
    if (count % 500 === 0) {
      await batch.commit();
      console.log(`Committed batch of 500. Total: ${count}`);
      batch = db.batch();
    }
  }

  if (count % 500 !== 0) {
    await batch.commit();
    console.log(`Committed final batch. Total seeded: ${count}`);
  }
}

const targetFile = process.argv[2] || 'scripts/seed_grade_5.json';
seedQuestions(targetFile).catch(console.error);
