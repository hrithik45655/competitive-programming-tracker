import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ArrowLeft, BookOpen, Clock, Target, Code2 } from 'lucide-react';

export default function EditProblem() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '', platform: 'LeetCode', difficulty: 'Medium',
    confidence: 'Independent', topics: '', timeSpent: 0
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await api.get(`/problems/${id}`);
        const p = res.data.data;
        setFormData({
          title: p.title,
          platform: p.platform,
          difficulty: p.difficulty,
          confidence: p.confidence,
          topics: p.topics ? p.topics.join(', ') : '',
          timeSpent: p.timeSpent || 0
        });
      } catch (err) {
        console.error(err);
        alert('Failed to load problem');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        topics: formData.topics.split(',').map(t => t.trim()).filter(Boolean)
      };
      await api.put(`/problems/${id}`, payload);
      navigate('/problems');
    } catch (err) {
      console.error(err);
      alert('Failed to update problem: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const selectStyles = "w-full h-10 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#09090b] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white/30 text-gray-900 dark:text-gray-100 shadow-sm transition-colors";

  if (initialLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-6 w-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Edit Problem</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update details for {formData.title}</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="divide-y divide-gray-100 dark:divide-white/5">
            {/* Core Details */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                <Code2 className="h-4 w-4 text-indigo-500" /> Core Details
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Problem Title</label>
                <Input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Two Sum" className="max-w-xl" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Platform</label>
                  <select name="platform" value={formData.platform} onChange={handleChange} className={selectStyles}>
                    {['LeetCode', 'CodeChef', 'Codeforces', 'HackerRank', 'GeeksforGeeks', 'Other'].map(p => <option key={p} className="bg-white dark:bg-[#09090b]">{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Difficulty</label>
                  <select name="difficulty" value={formData.difficulty} onChange={handleChange} className={selectStyles}>
                    {['Easy', 'Medium', 'Hard'].map(p => <option key={p} className="bg-white dark:bg-[#09090b]">{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Topics</label>
                <Input name="topics" value={formData.topics} onChange={handleChange} placeholder="Array, Dynamic Programming, Two Pointers (comma separated)" required className="max-w-xl" />
              </div>
            </div>

            {/* Performance */}
            <div className="p-6 md:p-8 space-y-6 bg-gray-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                <Target className="h-4 w-4 text-emerald-500" /> Performance & Scheduling
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confidence Level</label>
                  <select name="confidence" value={formData.confidence} onChange={handleChange} className={selectStyles}>
                    {['Independent', 'Hint Needed', 'Solution Watched'].map(p => <option key={p} className="bg-white dark:bg-[#09090b]">{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Time Spent (minutes)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input type="number" name="timeSpent" value={formData.timeSpent} onChange={handleChange} min="0" className="pl-9" />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 md:p-8 flex items-center gap-4 bg-gray-50 dark:bg-white/[0.04]">
              <Button type="button" variant="ghost" onClick={() => navigate('/problems')}>Cancel</Button>
              <Button type="submit" isLoading={loading}>Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
