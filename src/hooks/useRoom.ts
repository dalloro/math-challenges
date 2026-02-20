import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { generateRoomCode } from '../utils/roomCode';

export interface RoomState {
  roomCode: string;
  grade: number;
  currentLevel: number;
  streak: number;
  currentQuestionId: string | null;
  score: number;
  answers: Array<{
    questionId: string;
    answer: string;
    isCorrect: boolean;
    timestamp: number;
  }>;
  remainingSeconds: number;
  lastInteractionAt: number;
  createdAt: any;
}

const LOCAL_STORAGE_KEY = 'math_challenge_room_code';
const INACTIVITY_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export function useRoom({ grade, initialRoomCode }: { grade?: number; initialRoomCode?: string | null }) {
  const [roomCode, setRoomCode] = useState<string | null>(initialRoomCode || localStorage.getItem(LOCAL_STORAGE_KEY));
  const [roomData, setRoomData] = useState<RoomState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recoverTimer = (storedRemaining: number, lastInteraction: number) => {
    const now = Date.now();
    const elapsedMs = now - lastInteraction;
    // Only subtract up to the threshold (the time the user was 'active' before auto-pause)
    const activeElapsedSeconds = Math.floor(Math.min(elapsedMs, INACTIVITY_THRESHOLD_MS) / 1000);
    const recovered = storedRemaining - activeElapsedSeconds;
    return recovered > 0 ? recovered : 0;
  };

  const fetchRoom = useCallback(async (code: string) => {
    try {
      setLoading(true);
      const roomRef = doc(db, 'rooms', code);
      const roomSnap = await getDoc(roomRef);

      if (roomSnap.exists()) {
        const data = roomSnap.data() as RoomState;
        
        // Timer Recovery Logic
        const recoveredSeconds = recoverTimer(data.remainingSeconds, data.lastInteractionAt);
        
        const finalData = {
          ...data,
          remainingSeconds: recoveredSeconds,
          streak: data.streak || 0,
          currentQuestionId: data.currentQuestionId || null
        };
        
        setRoomData(finalData);
        setRoomCode(code);
        localStorage.setItem(LOCAL_STORAGE_KEY, code);
      } else {
        setError('Room not found or expired.');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Error fetching room:', err);
      setError('Failed to load room session.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createRoom = useCallback(async (targetGrade: number) => {
    try {
      setLoading(true);
      const newCode = generateRoomCode();
      const newRoom: RoomState = {
        roomCode: newCode,
        grade: targetGrade,
        currentLevel: 1,
        streak: 0,
        currentQuestionId: null,
        score: 0,
        answers: [],
        remainingSeconds: 3600, // 60 minutes
        lastInteractionAt: Date.now(),
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, 'rooms', newCode), newRoom);
      setRoomData(newRoom);
      setRoomCode(newCode);
      localStorage.setItem(LOCAL_STORAGE_KEY, newCode);
    } catch (err) {
      console.error('Error creating room:', err);
      setError('Failed to start new session.');
    } finally {
      setLoading(false);
    }
  }, []);

  const syncRoom = useCallback(async (updates: Partial<RoomState>) => {
    if (!roomCode) return;

    try {
      const roomRef = doc(db, 'rooms', roomCode);
      const payload = {
        ...updates,
        lastInteractionAt: Date.now()
      };
      
      await setDoc(roomRef, payload, { merge: true });
      
      // Update local state without relying on previous roomData in dependency array
      setRoomData(prev => prev ? ({ ...prev, ...payload }) : null);
    } catch (err) {
      console.error('Error syncing room:', err);
    }
  }, [roomCode]);

  useEffect(() => {
    if (roomCode && !roomData) {
      fetchRoom(roomCode);
    } else if (!roomCode && grade) {
      createRoom(grade);
    } else {
      setLoading(false);
    }
  }, [roomCode, grade, roomData, fetchRoom, createRoom]);

  return { roomCode, roomData, loading, error, syncRoom };
}
