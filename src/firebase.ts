import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "math-challenges-gifted",
  appId: "1:589334742260:web:4e7cbf3c417c493f6e8aa1",
  storageBucket: "math-challenges-gifted.firebasestorage.app",
  apiKey: "AIzaSyArf6jpOKlf4nTzAR20aVbG4ffagpKVYzA",
  authDomain: "math-challenges-gifted.firebaseapp.com",
  messagingSenderId: "589334742260"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
