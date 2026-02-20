import { useState, useMemo } from 'react';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Plus, Check, AlertCircle, Trash2 } from 'lucide-react';

interface FailureMode {
  title: string;
  content: string;
}

interface QuestionFormData {
  grade: number;
  level: number;
  type: string;
  question: string;
  options: string[];
  correct_answer: string;
  ideal_solution: string;
  failure_modes_list: FailureMode[];
}

export function QuestionWizard() {
  const [formData, setFormData] = useState<QuestionFormData>({
    grade: 5,
    level: 1,
    type: '',
    question: '',
    options: ['', '', '', '', ''],
    correct_answer: '',
    ideal_solution: '',
    failure_modes_list: [
      { title: '', content: '' }
    ]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isValid = useMemo(() => {
    const hasQuestion = formData.question.trim().length >= 5;
    const hasType = formData.type.trim().length > 0;
    const hasOptions = formData.options.every(opt => opt.trim().length > 0);
    const hasCorrectAnswer = formData.correct_answer !== '' && formData.options.includes(formData.correct_answer);
    const hasSolution = formData.ideal_solution.trim().length >= 10;
    const hasValidFailures = formData.failure_modes_list.every(f => f.title.trim() !== '' && f.content.trim() !== '');
    
    return hasQuestion && hasType && hasOptions && hasCorrectAnswer && hasSolution && hasValidFailures;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      // 1. Duplicate Check
      const q = query(
        collection(db, 'questions'), 
        where('grade', '==', formData.grade),
        where('question', '==', formData.question.trim())
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        throw new Error('A question with this exact text already exists in this grade.');
      }

      // 2. Transform failure_modes_list to object for database
      const failure_modes: Record<string, string> = {};
      formData.failure_modes_list.forEach(f => {
        const key = f.title.toLowerCase().replace(/\s+/g, '_');
        failure_modes[key] = f.content;
      });

      // 3. Save to Firestore
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { failure_modes_list, ...submitData } = formData;

      await addDoc(collection(db, 'questions'), {
        ...submitData,
        failure_modes,
        question: formData.question.trim(),
        difficulty: 'gifted',
        createdAt: serverTimestamp()
      });

      setStatus({ type: 'success', message: 'Question added successfully!' });
      setFormData(prev => ({
        ...prev,
        question: '',
        options: ['', '', '', '', ''],
        correct_answer: '',
        ideal_solution: '',
        failure_modes_list: [{ title: '', content: '' }]
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setStatus({ type: 'error', message: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addFailureMode = () => {
    if (formData.failure_modes_list.length < 3) {
      setFormData({
        ...formData,
        failure_modes_list: [...formData.failure_modes_list, { title: '', content: '' }]
      });
    }
  };

  const removeFailureMode = (index: number) => {
    const newList = formData.failure_modes_list.filter((_, i) => i !== index);
    setFormData({ ...formData, failure_modes_list: newList });
  };

  const updateFailureMode = (index: number, field: keyof FailureMode, value: string) => {
    const newList = [...formData.failure_modes_list];
    newList[index] = { ...newList[index], [field]: value };
    setFormData({ ...formData, failure_modes_list: newList });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Grade Level</label>
          <select 
            value={formData.grade}
            onChange={(e) => setFormData({...formData, grade: parseInt(e.target.value)})}
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
          >
            {Array.from({length: 12}, (_, i) => i + 1).map(g => <option key={g} value={g}>Grade {g}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Difficulty Level</label>
          <select 
            value={formData.level}
            onChange={(e) => setFormData({...formData, level: parseInt(e.target.value)})}
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
          >
            {Array.from({length: 10}, (_, i) => i + 1).map(l => <option key={l} value={l}>Level {l}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Question Type</label>
          <input 
            type="text"
            list="type-suggestions"
            placeholder="e.g. Number Theory"
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
          />
          <datalist id="type-suggestions">
            <option value="Logic" />
            <option value="Geometry" />
            <option value="Number Theory" />
            <option value="Algebraic Thinking" />
            <option value="Arithmetic" />
          </datalist>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Question Content</label>
        <textarea 
          placeholder="Enter the math challenge..."
          value={formData.question}
          onChange={(e) => setFormData({...formData, question: e.target.value})}
          className="w-full h-32 p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-lg resize-none"
        />
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Answer Options (A-E)</label>
        <div className="grid grid-cols-1 gap-3">
          {formData.options.map((opt, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-xs">
                {String.fromCharCode(65 + idx)}
              </span>
              <input 
                type="text"
                placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                value={opt}
                onChange={(e) => updateOption(idx, e.target.value)}
                className="flex-1 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setFormData({...formData, correct_answer: opt})}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  formData.correct_answer === opt && opt !== '' 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {formData.correct_answer === opt && opt !== '' ? 'Correct' : 'Set Correct'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Failure Modes (Max 3)</label>
          {formData.failure_modes_list.length < 3 && (
            <button 
              type="button" 
              onClick={addFailureMode}
              className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800"
            >
              + Add Mode
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          {formData.failure_modes_list.map((fm, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 relative group">
              {formData.failure_modes_list.length > 1 && (
                <button 
                  onClick={() => removeFailureMode(idx)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <input 
                type="text"
                placeholder="Mode Title (e.g. Calculation Error)"
                value={fm.title}
                onChange={(e) => updateFailureMode(idx, 'title', e.target.value)}
                className="w-full bg-transparent border-b border-gray-200 focus:border-blue-500 outline-none text-sm font-bold pb-1"
              />
              <textarea 
                placeholder="Feedback for this specific error..."
                value={fm.content}
                onChange={(e) => updateFailureMode(idx, 'content', e.target.value)}
                className="w-full bg-transparent outline-none text-sm resize-none h-20"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ideal Socratic Solution</label>
        <textarea 
          placeholder="Explain the step-by-step logic..."
          value={formData.ideal_solution}
          onChange={(e) => setFormData({...formData, ideal_solution: e.target.value})}
          className="w-full h-48 p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm leading-relaxed"
        />
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <div className="flex-1 mr-8">
          {status && (
            <div className={`p-4 rounded-xl flex items-center space-x-3 animate-in fade-in duration-300 ${
              status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {status.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
              <span className="text-xs font-bold uppercase tracking-tight">{status.message}</span>
            </div>
          )}
        </div>
        <button
          disabled={!isValid || isSubmitting}
          className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xl shadow-blue-100 flex items-center space-x-2"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Plus size={20} />
              <span>Add Question to Bank</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
