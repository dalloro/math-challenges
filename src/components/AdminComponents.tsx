import { useState, useMemo } from 'react';
import { collection, addDoc, query, where, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Plus, Check, AlertCircle, Terminal, Trash2, Search, Info, Download } from 'lucide-react';

interface Question {
  id?: string;
  grade: number;
  level: number;
  type: string;
  question: string;
  options: string[];
  correct_answer: string;
  ideal_solution: string;
  failure_modes: Record<string, string>;
}

// --- BULK EDITOR COMPONENT ---
export function BulkUpload() {
  const [jsonInput, setJsonInput] = useState('');
  const [isProcessing, setIsSubmitting] = useState(false);
  const [refreshMode, setRefreshMode] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing || !jsonInput.trim()) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      const questions: Question[] = JSON.parse(jsonInput);
      if (!Array.isArray(questions)) throw new Error('Input must be a JSON array.');

      const batch = writeBatch(db);
      
      // 1. Handle Refresh Mode (Purge scope before import)
      if (refreshMode) {
        // Collect all Grade/Level pairs from the input
        const scopes = new Set<string>();
        questions.forEach(q => scopes.add(`${q.grade}-${q.level}`));
        
        for (const scope of scopes) {
          const [g, l] = scope.split('-').map(Number);
          const purgeQuery = query(
            collection(db, 'questions'), 
            where('grade', '==', g),
            where('level', '==', l)
          );
          const snap = await getDocs(purgeQuery);
          snap.forEach(d => batch.delete(d.ref));
        }
      }

      let addedCount = 0;
      let skippedCount = 0;

      for (const qData of questions) {
        if (!qData.question || !qData.grade || !qData.level) continue;

        // Duplicate check (Only if NOT in refresh mode, since refresh mode just purged the scope)
        if (!refreshMode) {
          const existingQuery = query(
            collection(db, 'questions'), 
            where('grade', '==', qData.grade),
            where('question', '==', qData.question.trim())
          );
          const snapshot = await getDocs(existingQuery);
          
          if (!snapshot.empty) {
            skippedCount++;
            continue;
          }
        }

        const newDocRef = doc(collection(db, 'questions'));
        batch.set(newDocRef, {
          ...qData,
          question: qData.question.trim(),
          difficulty: 'gifted',
          createdAt: new Date()
        });
        addedCount++;
      }

      await batch.commit();
      setStatus({ 
        type: 'success', 
        message: `Import complete! ${refreshMode ? 'Refreshed' : 'Appended'} ${addedCount} questions. ${skippedCount > 0 ? `Skipped ${skippedCount} duplicates.` : ''}` 
      });
      setJsonInput('');
    } catch (err: any) {
      setStatus({ type: 'error', message: `Import error: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleBulkSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Bulk JSON Import</h3>
          <p className="text-sm text-gray-500">Paste an array of question objects here.</p>
        </div>
        <div className="flex items-center space-x-3 bg-gray-50 p-2 pl-4 rounded-xl border border-gray-200 group relative">
          <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
            <p className="font-bold mb-1">Refresh Mode Logic:</p>
            <p className="leading-relaxed">
              <span className="text-blue-400">ON:</span> Deletes all existing questions for the Grades/Levels in your JSON before adding new ones. (Clean Replace)
              <br/><br/>
              <span className="text-green-400">OFF:</span> Keeps existing questions and only adds new ones, automatically skipping exact duplicates. (Safe Append)
            </p>
          </div>
          <input 
            type="checkbox" 
            id="refresh-mode"
            checked={refreshMode}
            onChange={() => setRefreshMode(!refreshMode)}
            className="w-4 h-4 text-blue-600 rounded cursor-pointer"
          />
          <label htmlFor="refresh-mode" className="text-[10px] font-black uppercase tracking-widest text-gray-500 cursor-pointer">
            Refresh Mode
          </label>
          <Info size={14} className="text-gray-400" />
        </div>
      </div>

      <div className="relative group">
        <div className="absolute top-4 left-4 text-gray-400 group-focus-within:text-blue-500 transition-colors">
          <Terminal size={20} />
        </div>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='[ { "question": "...", "grade": 5, ... } ]'
          className="w-full h-96 p-6 pl-12 rounded-2xl border-2 border-gray-100 focus:border-blue-500 focus:ring-0 outline-none font-mono text-sm leading-relaxed bg-gray-50/30 transition-all"
        />
      </div>

      {status && (
        <div className={`p-4 rounded-xl flex items-center space-x-3 ${
          status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {status.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <span className="text-xs font-bold uppercase tracking-tight">{status.message}</span>
        </div>
      )}

      <button
        disabled={!jsonInput.trim() || isProcessing}
        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black disabled:opacity-20 transition-all flex items-center justify-center space-x-2"
      >
        {isProcessing ? 'Processing Batch...' : 'Import Question Array'}
      </button>
    </form>
  );
}

// --- EXPORTER COMPONENT ---
export function QuestionExporter() {
  const [grade, setGrade] = useState<number | 'all'>(5);
  const [isExporting, setIsExporting] = useState(false);

  const downloadJson = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      let q;
      if (grade === 'all') {
        q = query(collection(db, 'questions'));
      } else {
        q = query(collection(db, 'questions'), where('grade', '==', grade));
      }

      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        alert(grade === 'all' ? 'The database is empty.' : `No questions found for Grade ${grade}. Nothing to download.`);
        return;
      }

      const allQuestions = snapshot.docs.map(d => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, createdAt, ...clean } = d.data();
        return clean;
      });

      if (grade === 'all') {
        // Group by grade and download multiple files
        const grouped = allQuestions.reduce((acc: Record<number, any[]>, curr: any) => {
          const g = curr.grade;
          if (!acc[g]) acc[g] = [];
          acc[g].push(curr);
          return acc;
        }, {});

        const entries = Object.entries(grouped);
        for (const [g, data] of entries) {
          downloadJson(data, `seed_grade_${g}.json`);
          // Small delay to prevent browser from blocking multiple downloads
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } else {
        downloadJson(allQuestions, `seed_grade_${grade}.json`);
      }
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Check console for details.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-blue-900">Backup & Export</h3>
          <p className="text-xs text-blue-700">Save questions as JSON seed files.</p>
        </div>
        <div className="p-2 bg-blue-100 rounded-xl">
          <Download className="text-blue-600" size={20} />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-blue-400">Target Scope</label>
        <select 
          value={grade}
          onChange={(e) => setGrade(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
          className="w-full p-3 rounded-xl border border-blue-200 bg-white text-sm font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        >
          <option value="all">All Grades (Batch)</option>
          {Array.from({length: 12}, (_, i) => i + 1).map(g => <option key={g} value={g}>Grade {g}</option>)}
        </select>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-200"
        >
          {isExporting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <>
              <Download size={16} />
              <span>Download JSON Files</span>
            </>
          )}
        </button>
      </div>
      
      <div className="pt-2 border-t border-blue-100">
        <p className="text-[9px] text-blue-500 leading-relaxed italic">
          Files follow the seed script convention: <span className="font-mono bg-blue-100 px-1 rounded">seed_grade_X.json</span>
        </p>
      </div>
    </div>
  );
}

// --- QUESTION LIST COMPONENT ---
export function QuestionExplorer() {
  const [grade, setGrade] = useState(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'questions'), where('grade', '==', grade));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Question));
      setQuestions(data.sort((a, b) => a.level - b.level));
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      // In a real app, we'd use a proper delete service
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'questions', id));
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6 pt-12 border-t border-gray-200 mt-12">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Live Question Explorer</h3>
        <div className="flex items-center space-x-4">
          <select 
            value={grade}
            onChange={(e) => setGrade(parseInt(e.target.value))}
            className="p-2 rounded-lg border border-gray-200 text-sm font-bold"
          >
            {Array.from({length: 12}, (_, i) => i + 1).map(g => <option key={g} value={g}>Grade {g}</option>)}
          </select>
          <button 
            onClick={fetchQuestions}
            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Search size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-400 font-medium">Scanning database...</div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
            Error: {error}
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-8 text-gray-400 font-medium italic border-2 border-dashed border-gray-100 rounded-3xl">
            Select a grade and click search to view questions.
          </div>
        ) : (
          questions.map(q => (
            <div key={q.id} className="bg-white border border-gray-100 p-6 rounded-2xl flex justify-between items-start group hover:border-gray-300 transition-all shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[8px] font-black uppercase rounded">Lvl {q.level}</span>
                  <span className="text-xs font-bold text-gray-400">{q.type}</span>
                </div>
                <p className="text-gray-800 font-medium leading-relaxed">{q.question}</p>
              </div>
              <button 
                onClick={() => q.id && deleteQuestion(q.id)}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
