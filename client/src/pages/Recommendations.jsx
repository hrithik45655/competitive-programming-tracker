import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { AlertTriangle, Lightbulb, Target } from 'lucide-react';

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

  if (loading) return <div className="text-center py-12 dark:text-gray-400">Analyzing your profile...</div>;

  const getIcon = (type) => {
    if (type === 'TOPIC') return <Target className="h-6 w-6 text-indigo-500" />;
    if (type === 'REVISION') return <AlertTriangle className="h-6 w-6 text-orange-500" />;
    return <Lightbulb className="h-6 w-6 text-yellow-500" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">What to Practice Next</h2>
        <p className="text-gray-500 dark:text-gray-400">Personalized suggestions based on your performance and spaced repetition queue.</p>
      </div>
      
      <div className="space-y-4">
        {recs.length === 0 ? (
          <div className="text-center py-12 dark:text-gray-400">Keep solving problems to get personalized recommendations!</div>
        ) : (
          recs.map((rec, index) => (
            <Card key={index} className="flex flex-row items-center p-6 gap-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full flex-shrink-0">
                {getIcon(rec.type)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {rec.type === 'TOPIC' ? `Focus on ${rec.topic}` : rec.type === 'REVISION' ? `Revise: ${rec.problem.title}` : `Level up in ${rec.topic}`}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{rec.reason}</p>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  rec.priority === 'HIGH' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {rec.priority} PRIORITY
                </span>
              </div>
              <div>
                <Button variant={rec.priority === 'HIGH' ? 'primary' : 'outline'}>
                  {rec.action === 'PRACTICE' ? 'Practice' : rec.action === 'REVISE' ? 'Revise Now' : 'Find Problems'}
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
