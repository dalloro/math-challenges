import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { TrendingUp, Users, PieChart as PieIcon, AlertCircle, Calendar, Target } from 'lucide-react';

interface Question {
  id: string;
  grade: number;
  level: number;
  type: string;
  question: string;
}

interface QuestionStat {
  id: string;
  total_attempts: number;
  total_correct: number;
  total_time_ms: number;
}

interface DailyStat {
  id: string;
  questionId: string;
  date: string;
  attempts: number;
  correct: number;
  time_ms: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export function AdminAnalytics() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState<QuestionStat[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number>(5);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [qSnap, sSnap, dSnap] = await Promise.all([
          getDocs(collection(db, 'questions')),
          getDocs(collection(db, 'question_stats')),
          getDocs(query(collection(db, 'question_daily_stats'), orderBy('date', 'desc'), limit(500)))
        ]);

        const qData = qSnap.docs.map(d => ({ id: d.id, ...d.data() } as Question));
        const sData = sSnap.docs.map(d => ({ id: d.id, ...d.data() } as QuestionStat));
        const dData = dSnap.docs.map(d => ({ id: d.id, ...d.data() } as DailyStat));

        setQuestions(qData);
        setStats(sData);
        setDailyStats(dData);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError('Failed to load analytics data.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Aggregated data for Global Performance (Success Rate per Grade/Level)
  const performanceData = useMemo(() => {
    const cohortMap: Record<string, { attempts: number; correct: number }> = {};
    
    stats.forEach(s => {
      const q = questions.find(question => question.id === s.id);
      if (!q || q.grade !== selectedGrade) return;

      const key = `Lvl ${q.level}`;
      if (!cohortMap[key]) cohortMap[key] = { attempts: 0, correct: 0 };
      
      cohortMap[key].attempts += s.total_attempts;
      cohortMap[key].correct += s.total_correct;
    });

    return Object.entries(cohortMap)
      .map(([name, data]) => ({
        name,
        successRate: data.attempts > 0 ? Math.round((data.correct / data.attempts) * 100) : 0,
        attempts: data.attempts
      }))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  }, [questions, stats, selectedGrade]);

  // Aggregated trend data for the last 7 active days
  const trendData = useMemo(() => {
    const dayMap: Record<string, { attempts: number; correct: number }> = {};
    
    dailyStats.forEach(ds => {
      const q = questions.find(question => question.id === ds.questionId);
      if (!q || q.grade !== selectedGrade) return;

      if (!dayMap[ds.date]) dayMap[ds.date] = { attempts: 0, correct: 0 };
      dayMap[ds.date].attempts += ds.attempts;
      dayMap[ds.date].correct += ds.correct;
    });

    return Object.entries(dayMap)
      .map(([date, data]) => ({
        date,
        successRate: data.attempts > 0 ? Math.round((data.correct / data.attempts) * 100) : 0
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7);
  }, [questions, dailyStats, selectedGrade]);

  // Aggregated data for Cohort Composition (Type Distribution)
  const compositionData = useMemo(() => {
    const typeMap: Record<string, number> = {};
    
    questions.forEach(q => {
      if (q.grade !== selectedGrade) return;
      typeMap[q.type] = (typeMap[q.type] || 0) + 1;
    });

    return Object.entries(typeMap).map(([name, value]) => ({ name, value }));
  }, [questions, selectedGrade]);

  // Heuristic for Discrimination Index
  const getDiscriminationLabel = (s: QuestionStat) => {
    if (s.total_attempts < 5) return 'Low Data';
    const rate = s.total_correct / s.total_attempts;
    if (rate > 0.85) return 'Too Easy';
    if (rate < 0.25) return 'Too Hard';
    return 'Calibrated';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 text-gray-400">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="font-bold uppercase tracking-widest text-xs">Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-red-600 flex items-center space-x-4">
        <AlertCircle size={24} />
        <p className="font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Grade Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <TrendingUp className="text-blue-600" size={24} />
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Analytics Overview</h2>
        </div>
        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(parseInt(e.target.value))}
          className="p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
            <option key={g} value={g}>Grade {g}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Success Rate Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Users className="text-blue-600" size={20} />
            </div>
            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs">Global Performance Distribution</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" />
                <YAxis axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="successRate" name="Success Rate" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-gray-400 font-medium text-center">Average percentage of correct answers per level for Grade {selectedGrade}.</p>
        </div>

        {/* Performance Trends Line Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-xl">
              <Calendar className="text-green-600" size={20} />
            </div>
            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs">Historical Performance Trends</h3>
          </div>
          <div className="h-64 w-full">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" />
                  <YAxis axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="successRate" name="Success Rate" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-2">
                <Calendar size={48} strokeWidth={1} />
                <p className="text-xs font-bold uppercase tracking-widest">No historical data yet</p>
              </div>
            )}
          </div>
          <p className="text-[10px] text-gray-400 font-medium text-center">Daily success rate over the last 7 active days.</p>
        </div>

        {/* Composition Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-50 rounded-xl">
              <PieIcon className="text-purple-600" size={20} />
            </div>
            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs">Cohort Composition</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={compositionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {compositionData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-gray-400 font-medium text-center">Distribution of question types in Grade {selectedGrade}.</p>
        </div>

        {/* Calibration Stats */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-50 rounded-xl">
              <Target className="text-amber-600" size={20} />
            </div>
            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs">Calibration Summary</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-gray-50 rounded-2xl space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg. Success</p>
              <p className="text-3xl font-black text-gray-900">
                {performanceData.length > 0 ? Math.round(performanceData.reduce((a, b) => a + b.successRate, 0) / performanceData.length) : 0}%
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Attempts</p>
              <p className="text-3xl font-black text-gray-900">
                {performanceData.reduce((a, b) => a + b.attempts, 0)}
              </p>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 font-medium">Aggregated metrics across all levels for the selected grade.</p>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-6">Question Performance Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="pb-4 pl-2">Level</th>
                <th className="pb-4">Type</th>
                <th className="pb-4">Success Rate</th>
                <th className="pb-4">Avg. Time</th>
                <th className="pb-4">Calibration</th>
                <th className="pb-4 text-right pr-2">Attempts</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-gray-600">
              {stats.filter(s => questions.find(q => q.id === s.id && q.grade === selectedGrade)).map(s => {
                const q = questions.find(question => question.id === s.id);
                const successRate = Math.round((s.total_correct / s.total_attempts) * 100);
                const avgTime = Math.round((s.total_time_ms / s.total_attempts) / 1000);
                const calibration = getDiscriminationLabel(s);
                return (
                  <tr key={s.id} className="border-b border-gray-50/50 hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 pl-2 font-bold text-gray-900">Lvl {q?.level}</td>
                    <td className="py-4 text-xs font-bold text-gray-400 uppercase">{q?.type}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${
                        successRate > 80 ? 'bg-green-50 text-green-600' : successRate > 50 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {successRate}%
                      </span>
                    </td>
                    <td className="py-4 font-mono text-xs">{avgTime}s</td>
                    <td className="py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        calibration === 'Calibrated' ? 'text-green-500' : calibration === 'Low Data' ? 'text-gray-300' : 'text-amber-500'
                      }`}>
                        {calibration}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-2 font-bold text-gray-400">{s.total_attempts}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
