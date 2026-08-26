import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function AddProblem() {
  const [formData, setFormData] = useState({
    title: '', platform: 'LeetCode', difficulty: 'Medium',
    confidence: 'Independent', topics: '', timeSpent: 0
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        topics: formData.topics.split(',').map(t => t.trim()).filter(Boolean)
      };
      await api.post('/problems', payload);
      navigate('/problems'); // redirect back to problem list
    } catch (err) {
      console.error(err);
      alert('Failed to add problem: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Log New Problem</h2>
        <p className="text-gray-500 dark:text-gray-400">Add a problem to your tracker to schedule it for spaced repetition.</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Problem Title</label>
              <Input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Two Sum" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Platform</label>
                <select name="platform" value={formData.platform} onChange={handleChange} className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {['LeetCode', 'CodeChef', 'Codeforces', 'HackerRank', 'GeeksforGeeks', 'Other'].map(p => <option key={p} className="dark:bg-gray-900">{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Difficulty</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {['Easy', 'Medium', 'Hard'].map(p => <option key={p} className="dark:bg-gray-900">{p}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Topics (comma separated)</label>
              <Input name="topics" value={formData.topics} onChange={handleChange} placeholder="Array, Dynamic Programming, Two Pointers" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Confidence Level</label>
                <select name="confidence" value={formData.confidence} onChange={handleChange} className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {['Independent', 'Hint Needed', 'Solution Watched'].map(p => <option key={p} className="dark:bg-gray-900">{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Time Spent (minutes)</label>
                <Input type="number" name="timeSpent" value={formData.timeSpent} onChange={handleChange} min="0" />
              </div>
            </div>
            <div className="pt-4 flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/problems')} className="flex-1">Cancel</Button>
              <Button type="submit" isLoading={loading} className="flex-1">Save & Schedule</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
