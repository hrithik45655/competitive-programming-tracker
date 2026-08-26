import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { AlertTriangle, Lightbulb, Target, Sparkles, ChevronRight } from 'lucide-react';

export default function Recommendations() {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await api.get('/recommendations');
        setRecs(res.data.data.recommendations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <Sparkles className="h-6 w-6 animate-pulse text-indigo-500" />
      <span className="text-sm font-medium text-gray-500">Generating intelligent recommendations...</span>
    </div>
  );

  const getIcon = (type) => {
    if (type === 'TOPIC') return <Target className="h-5 w-5 text-indigo-500" />;
    if (type === 'REVISION') return <AlertTriangle className="h-5 w-5 text-rose-500" />;
    return <Lightbulb className="h-5 w-5 text-amber-500" />;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="border-b border-gray-200 dark:border-white/10 pb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">What to Practice Next</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Data-driven suggestions tailored to your performance.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" /> AI Powered
        </div>
      </div>
      
      <div className="space-y-4">
        {recs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-white/[0.02]">
            <Sparkles className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-900 dark:text-white font-medium">No recommendations yet</p>
            <p className="text-sm text-gray-500 mt-1">Keep solving problems and we'll analyze your patterns!</p>
          </div>
        ) : (
          recs.map((rec, index) => (
            <Card key={index} className="flex flex-col sm:flex-row items-start sm:items-center p-5 gap-5 hover:border-gray-300 dark:hover:border-white/20 transition-all group">
              <div className="bg-white dark:bg-[#09090b] shadow-sm border border-gray-100 dark:border-white/10 p-3 rounded-xl flex-shrink-0">
                {getIcon(rec.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                    rec.priority === 'HIGH' ? 'bg-rose-100 text-rose-800 dark:bg-rose-500/10 dark:text-rose-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400'
                  }`}>
                    {rec.priority} Priority
                  </span>
                  <span className="text-xs text-gray-400 font-medium tracking-wide">{rec.type}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">
                  {rec.type === 'TOPIC' ? `Focus on ${rec.topic}` : rec.type === 'REVISION' ? `Revise: ${rec.problem.title}` : `Level up in ${rec.topic}`}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{rec.reason}</p>
              </div>
              <div className="w-full sm:w-auto mt-4 sm:mt-0">
                <Button variant={rec.priority === 'HIGH' ? 'primary' : 'secondary'} className="w-full sm:w-auto group-hover:shadow-sm">
                  {rec.action === 'PRACTICE' ? 'Find Problems' : rec.action === 'REVISE' ? 'Revise Now' : 'Level Up'}
                  <ChevronRight className="h-4 w-4 ml-1 opacity-50" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
