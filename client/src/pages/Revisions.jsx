import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Clock, CheckCircle2, RotateCcw, HelpCircle, Eye } from 'lucide-react';

export default function Revisions() {
  const [dueProblems, setDueProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDueRevisions = async () => {
    try {
      const res = await api.get('/revisions/due');
      setDueProblems(res.data.data);
    } catch (err) {
      console.error('Failed to fetch due revisions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDueRevisions();
  }, []);

  const handleMarkRevised = async (problemId, confidence) => {
    try {
      await api.post('/revisions', { problemId, confidenceAfter: confidence, notes: 'Revised from queue' });
      fetchDueRevisions();
    } catch (err) {
      console.error('Failed to record revision', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-gray-200 dark:border-white/10 pb-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Revision Queue</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Problems scheduled for spaced repetition review today.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
        </div>
      ) : dueProblems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">All caught up!</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-center max-w-sm">
            You have no pending revisions for today. Take a break or solve some new problems to add them to your queue.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dueProblems.map((problem) => (
            <Card key={problem._id} className="flex flex-col group overflow-hidden border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                    problem.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                    problem.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                    'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                  }`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded">
                    Rev #{problem.revisionCount + 1}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1 line-clamp-2">
                  {problem.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">{problem.platform}</p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {problem.topics.slice(0, 3).map(topic => (
                    <span key={topic} className="px-2 py-0.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-300 rounded text-xs">
                      {topic}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400/80 font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  Due {new Date(problem.nextRevisionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-white/[0.03] border-t border-gray-100 dark:border-white/5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-3 text-center">Score your revision</p>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => handleMarkRevised(problem._id, 'Independent')}
                    className="flex flex-col items-center justify-center p-2 rounded-lg border border-gray-200 dark:border-white/10 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 dark:hover:border-emerald-500/50 text-gray-600 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all group/btn"
                    title="Independent"
                  >
                    <RotateCcw className="h-4 w-4 mb-1 opacity-70 group-hover/btn:opacity-100" />
                    <span className="text-[10px] font-medium">Solo</span>
                  </button>
                  <button 
                    onClick={() => handleMarkRevised(problem._id, 'Hint Needed')}
                    className="flex flex-col items-center justify-center p-2 rounded-lg border border-gray-200 dark:border-white/10 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 dark:hover:border-amber-500/50 text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 transition-all group/btn"
                    title="Needed Hint"
                  >
                    <HelpCircle className="h-4 w-4 mb-1 opacity-70 group-hover/btn:opacity-100" />
                    <span className="text-[10px] font-medium">Hint</span>
                  </button>
                  <button 
                    onClick={() => handleMarkRevised(problem._id, 'Solution Watched')}
                    className="flex flex-col items-center justify-center p-2 rounded-lg border border-gray-200 dark:border-white/10 hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 dark:hover:border-rose-500/50 text-gray-600 dark:text-gray-400 hover:text-rose-700 dark:hover:text-rose-400 transition-all group/btn"
                    title="Watched Solution"
                  >
                    <Eye className="h-4 w-4 mb-1 opacity-70 group-hover/btn:opacity-100" />
                    <span className="text-[10px] font-medium">Solution</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
