import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

// Note: You will need serviceAccountKey.json to run this
const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('Error: serviceAccountKey.json not found.');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function purgeExpiredRooms() {
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  console.log(`Purging rooms with no interaction since ${new Date(sevenDaysAgo).toLocaleString()}...`);

  const roomsRef = db.collection('rooms');
  const expiredRooms = await roomsRef.where('lastInteractionAt', '<', sevenDaysAgo).get();

  if (expiredRooms.empty) {
    console.log('No expired rooms found.');
    return;
  }

  const batch = db.batch();
  expiredRooms.forEach(doc => {
    console.log(`Deleting expired room: ${doc.id}`);
    batch.delete(doc.ref);
  });

  await batch.commit();
  console.log(`Successfully purged ${expiredRooms.size} rooms.`);
}

purgeExpiredRooms().catch(console.error);
