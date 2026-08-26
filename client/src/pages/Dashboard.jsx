import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { CheckCircle2, Clock, Flame, BrainCircuit, Activity, BookOpen, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        setData(res.data.data);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Activity className="h-8 w-8 animate-pulse text-gray-400" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500 dark:text-gray-400 flex-col gap-2">
        <AlertCircle className="h-6 w-6" />
        <p>Failed to load dashboard data.</p>
      </div>
    );
  }

  const confidenceData = [
    { name: 'Independent', value: data.independentCount, color: '#fafafa' }, // Light color in dark mode
    { name: 'Hint Needed', value: data.hintCount, color: '#a1a1aa' },
    { name: 'Solution Watched', value: data.solutionCount, color: '#3f3f46' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1 border-b border-gray-200 dark:border-white/10 pb-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Overview</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Your competitive programming journey at a glance.</p>
      </div>
      
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-gray-300 dark:hover:border-white/20 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-500 dark:text-gray-400 font-medium">Total Solved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{data.solvedCount || 0}</div>
            <p className="text-xs text-gray-400 mt-1">Out of {data.totalProblems} tracked</p>
          </CardContent>
        </Card>
        
        <Card className="hover:border-gray-300 dark:hover:border-white/20 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-500 dark:text-gray-400 font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{data.streaks?.currentStreak || 0} <span className="text-lg font-normal text-gray-400">days</span></div>
            <p className="text-xs text-gray-400 mt-1">Best: {data.streaks?.longestStreak || 0} days</p>
          </CardContent>
        </Card>
        
        <Card className="hover:border-gray-300 dark:hover:border-white/20 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-500 dark:text-gray-400 font-medium">Independent Rate</CardTitle>
            <BrainCircuit className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {data.solvedCount > 0 ? Math.round((data.independentCount / data.solvedCount) * 100) : 0}<span className="text-lg font-normal text-gray-400">%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{data.independentCount} problems solved solo</p>
          </CardContent>
        </Card>
        
        <Card className="hover:border-gray-300 dark:hover:border-white/20 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-500 dark:text-gray-400 font-medium">Difficulty</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex items-center text-sm"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div> <span className="flex-1 text-gray-600 dark:text-gray-300">Easy</span> <span className="font-medium text-gray-900 dark:text-white">{data.easyCount}</span></div>
              <div className="flex items-center text-sm"><div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div> <span className="flex-1 text-gray-600 dark:text-gray-300">Medium</span> <span className="font-medium text-gray-900 dark:text-white">{data.mediumCount}</span></div>
              <div className="flex items-center text-sm"><div className="w-2 h-2 rounded-full bg-rose-500 mr-2"></div> <span className="flex-1 text-gray-600 dark:text-gray-300">Hard</span> <span className="font-medium text-gray-900 dark:text-white">{data.hardCount}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Confidence Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                  {confidenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="col-span-3 flex flex-col gap-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/problems/add" className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white transition-colors p-4 rounded-lg font-medium text-sm group border border-transparent dark:hover:border-white/10">
                <span>Log New Problem</span>
                <span className="text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">→</span>
              </Link>
              <Link to="/recommendations" className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white transition-colors p-4 rounded-lg font-medium text-sm group border border-transparent dark:hover:border-white/10">
                <span>View Recommendations</span>
                <span className="text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">→</span>
              </Link>
              <Link to="/revisions" className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white transition-colors p-4 rounded-lg font-medium text-sm group border border-transparent dark:hover:border-white/10">
                <span>Check Revision Queue</span>
                <span className="text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">→</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
