import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, CheckCircle2 } from 'lucide-react';

interface SolutionDisplayProps {
  socraticHint: string | null;
  finalIdealSolution: string;
}

export function SolutionDisplay({ socraticHint, finalIdealSolution }: SolutionDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {socraticHint && (
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb size={18} className="text-blue-500" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400">Socratic Hint</h4>
          </div>
          <p className="text-blue-900 font-medium leading-relaxed italic text-lg">
            {socraticHint}
          </p>
        </div>
      )}

      <div className={`rounded-3xl border transition-all duration-500 ${
        isExpanded ? 'bg-white border-green-200 shadow-lg' : 'bg-gray-50 border-gray-100'
      }`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-6 focus:outline-none"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl transition-colors ${
              isExpanded ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              <CheckCircle2 size={18} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${
              isExpanded ? 'text-green-600' : 'text-gray-400'
            }`}>
              {isExpanded ? 'Ideal Solution' : 'Show Ideal Solution'}
            </span>
          </div>
          <div className={isExpanded ? 'text-green-600' : 'text-gray-400'}>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>

        {isExpanded && (
          <div className="px-6 pb-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="h-px bg-gray-100 mb-6" />
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                {finalIdealSolution}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
