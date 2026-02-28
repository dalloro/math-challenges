import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';

export interface Question {
  id: string;
  grade: number;
  level: number;
  difficulty: 'gifted';
  type: string;
  question: string;
  options: string[];
  correct_answer: string;
  ideal_solution: string;
  failure_modes: Record<string, string>;
}

export function useQuestions(grade: number) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'questions'),
          where('grade', '==', grade),
          where('difficulty', '==', 'gifted'),
          limit(1000) // Fetch a larger pool to cover all questions per grade
        );

        const querySnapshot = await getDocs(q);
        const fetchedQuestions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Question[];

        setQuestions(fetchedQuestions);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions.');
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [grade]);

  return { questions, loading, error };
}
