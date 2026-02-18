import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "math-challenges-gifted-99",
  appId: "1:299687337678:web:117f9078b94ca630f63a9f",
  storageBucket: "math-challenges-gifted-99.firebasestorage.app",
  apiKey: "AIzaSyBGAlV-Vk4hR8WKIyoqnj_Z3W1rKmE3x8A",
  authDomain: "math-challenges-gifted-99.firebaseapp.com",
  messagingSenderId: "299687337678"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
