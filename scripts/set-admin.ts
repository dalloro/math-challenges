import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';

// Usage: npx tsx scripts/set-admin.ts <UID> [true|false]
const uid = process.argv[2];
const isAdmin = process.argv[3] !== 'false';

if (!uid) {
  console.error('Usage: npx tsx scripts/set-admin.ts <UID> [true|false]');
  process.exit(1);
}

const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('Error: serviceAccountKey.json not found in root directory.');
  console.error('Please download it from Firebase Console -> Project Settings -> Service Accounts.');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

async function setAdminClaim(userUid: string, adminStatus: boolean) {
  try {
    await getAuth().setCustomUserClaims(userUid, { admin: adminStatus });
    console.log(`Successfully set admin claim to ${adminStatus} for user: ${userUid}`);
    
    // To see the change immediately, the user needs to force a token refresh
    console.log('Note: The user must sign out and sign back in, or call currentUser.getIdToken(true) to see the change.');
  } catch (error) {
    console.error('Error setting custom claims:', error);
  }
}

setAdminClaim(uid, isAdmin);
