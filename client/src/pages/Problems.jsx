import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Search, Plus, Filter, MoreHorizontal, ChevronLeft, ChevronRight, Hash } from 'lucide-react';

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchProblems = async (search = '') => {
    setLoading(true);
    try {
      const res = await api.get('/problems', {
        params: { page, limit: 20, search }
      });
      setProblems(res.data.data.problems);
      setTotalPages(res.data.data.pages);
    } catch (err) {
      console.error('Failed to fetch problems', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProblems(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, page]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Problems</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and search your completed algorithms.</p>
        </div>
        <Button className="flex items-center gap-2 shadow-sm" onClick={() => navigate('/problems/add')}>
          <Plus className="h-4 w-4" /> Log Problem
        </Button>
      </div>

      <div className="flex gap-3 items-center w-full">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input 
            type="text" 
            placeholder="Search titles or topics..." 
            className="pl-9 bg-gray-50 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-[#09090b]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filters
        </Button>
      </div>

      <Card className="overflow-hidden border-gray-200 dark:border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Problem</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Confidence</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Topics</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Next Revision</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <div className="flex justify-center mb-2">
                      <div className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                    </div>
                    Loading problems...
                  </td>
                </tr>
              ) : problems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-16">
                    <Hash className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-900 dark:text-white font-medium">No problems found</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Try adjusting your search or add a new one.</p>
                  </td>
                </tr>
              ) : (
                problems.map((problem) => (
                  <tr key={problem._id} className="bg-white dark:bg-[#09090b] hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{problem.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{problem.platform}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
                        problem.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                        problem.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                        'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {problem.confidence}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {problem.topics.slice(0, 2).map((topic, i) => (
                          <span key={i} className="inline-flex px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300">
                            {topic}
                          </span>
                        ))}
                        {problem.topics.length > 2 && (
                          <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400">
                            +{problem.topics.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                      {new Date(problem.nextRevisionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-all p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/10">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-gray-50/30 dark:bg-[#09090b]">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page <span className="font-medium text-gray-900 dark:text-white">{page}</span> of <span className="font-medium text-gray-900 dark:text-white">{totalPages || 1}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-2">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)} className="px-2">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
