/**
 * READ-ONLY: Query Firestore to check difficulty distribution across all grades.
 * Uses the client SDK. Does NOT modify any data.
 */
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    projectId: "math-challenges-gifted",
    apiKey: "AIzaSyArf6jpOKlf4nTzAR20aVbG4ffagpKVYzA",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function inspect() {
    console.log("Scanning Firestore database for question distribution...\n");

    const snap = await getDocs(collection(db, "questions"));
    const total = snap.size;
    console.log(`Total documents in 'questions' collection: ${total}`);

    // stats[grade][difficulty] = count
    const stats: Record<number, Record<string, number>> = {};
    const missingDifficulty: string[] = [];

    snap.forEach(doc => {
        const d = doc.data();
        const grade = d.grade || 0;
        const diff = d.difficulty || "(missing)";
        
        if (!stats[grade]) stats[grade] = {};
        stats[grade][diff] = (stats[grade][diff] || 0) + 1;

        if (!d.difficulty) {
            missingDifficulty.push(doc.id);
        }
    });

    const sortedGrades = Object.keys(stats).map(Number).sort((a, b) => a - b);

    for (const grade of sortedGrades) {
        const gradeStats = stats[grade];
        const gradeTotal = Object.values(gradeStats).reduce((a, b) => a + b, 0);
        
        console.log(`Grade ${grade}: ${gradeTotal} questions`);
        
        // Sort difficulties by name
        const diffs = Object.keys(gradeStats).sort();
        for (const diff of diffs) {
            const count = gradeStats[diff];
            const percentage = ((count / gradeTotal) * 100).toFixed(1);
            const warning = diff === 'gifted' ? ' ⚠️ (Needs Migration)' : '';
            console.log(`  - ${diff.padEnd(15)}: ${count.toString().padStart(4)} (${percentage}%)${warning}`);
        }
        console.log("");
    }

    if (missingDifficulty.length > 0) {
        console.log(`\nFound ${missingDifficulty.length} documents with missing difficulty field.`);
    }
}

inspect().catch(console.error);
