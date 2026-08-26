import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { CheckCircle, Clock, Flame, List as ListIcon, Brain } from 'lucide-react';
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-red-500">Failed to load dashboard data.</div>;
  }

  const confidenceData = [
    { name: 'Independent', value: data.independentCount, color: '#10b981' },
    { name: 'Hint Needed', value: data.hintCount, color: '#f59e0b' },
    { name: 'Solution Watched', value: data.solutionCount, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Dashboard Overview</h2>
        <p className="text-gray-500 dark:text-gray-400">Track your competitive programming progression.</p>
      </div>
      
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Solved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold dark:text-white">{data.solvedCount || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Out of {data.totalProblems} tracked</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold dark:text-white">{data.streaks?.currentStreak || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Best: {data.streaks?.longestStreak || 0} days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Independent Rate</CardTitle>
            <Brain className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold dark:text-white">
              {data.solvedCount > 0 ? Math.round((data.independentCount / data.solvedCount) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-500 mt-1">{data.independentCount} problems solved without hints</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Difficulty Spread</CardTitle>
            <ListIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 text-sm mt-2">
              <span className="text-green-600 dark:text-green-400 font-medium">E: {data.easyCount}</span>
              <span className="text-yellow-600 dark:text-yellow-400 font-medium">M: {data.mediumCount}</span>
              <span className="text-red-600 dark:text-red-400 font-medium">H: {data.hardCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Confidence Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {confidenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/problems" className="block w-full text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-300 transition-colors py-3 px-4 rounded-md font-medium text-sm">
              + Log New Problem
            </Link>
            <Link to="/recommendations" className="block w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors py-3 px-4 rounded-md font-medium text-sm">
              View Recommendations
            </Link>
            <Link to="/revisions" className="block w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors py-3 px-4 rounded-md font-medium text-sm">
              Check Revision Queue
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
