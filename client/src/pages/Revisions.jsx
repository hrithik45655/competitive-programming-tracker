import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Clock, CheckCircle2 } from 'lucide-react';

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
      // Remove from list or refresh
      fetchDueRevisions();
    } catch (err) {
      console.error('Failed to record revision', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Revision Queue</h2>
        <p className="text-gray-500 dark:text-gray-400">Problems that are due for spaced repetition review today.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 dark:text-gray-400">Loading your revision queue...</div>
      ) : dueProblems.length === 0 ? (
        <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-green-900 dark:text-green-400">All caught up!</h3>
            <p className="text-green-700 dark:text-green-500 mt-1">You have no pending revisions for today.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dueProblems.map((problem) => (
            <Card key={problem._id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{problem.title}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {problem.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{problem.platform}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="mb-4">
                  <div className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-500 mb-2">
                    <Clock className="h-4 w-4" />
                    Due {new Date(problem.nextRevisionDate).toLocaleDateString()}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {problem.topics.slice(0, 3).map(topic => (
                      <span key={topic} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded text-xs">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border-t dark:border-gray-800 pt-4 mt-2">
                  <p className="text-xs text-gray-500 mb-2 text-center">How did you do?</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs px-1 hover:bg-green-50 hover:text-green-600" onClick={() => handleMarkRevised(problem._id, 'Independent')}>Independent</Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs px-1 hover:bg-yellow-50 hover:text-yellow-600" onClick={() => handleMarkRevised(problem._id, 'Hint Needed')}>Needed Hint</Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs px-1 hover:bg-red-50 hover:text-red-600" onClick={() => handleMarkRevised(problem._id, 'Solution Watched')}>Watched Sol</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
