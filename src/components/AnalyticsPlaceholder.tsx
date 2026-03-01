import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Grade 1', success: 85 },
  { name: 'Grade 2', success: 72 },
  { name: 'Grade 3', success: 90 },
  { name: 'Grade 4', success: 65 },
  { name: 'Grade 5', success: 81 },
];

export function AnalyticsPlaceholder() {
  return (
    <div className="h-64 w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-sm min-h-[256px]">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
          <YAxis axisLine={false} tickLine={false} fontSize={12} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="success" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
