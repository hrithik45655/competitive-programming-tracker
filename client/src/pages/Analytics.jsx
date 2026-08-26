import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Activity } from 'lucide-react';

export default function Analytics() {
  const [trends, setTrends] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [trendsRes, platformsRes] = await Promise.all([
          api.get('/analytics/trends?period=day'),
          api.get('/analytics/platforms')
        ]);
        setTrends(trendsRes.data.data);
        setPlatforms(platformsRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <Activity className="h-8 w-8 animate-pulse text-gray-400" />
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#18181b] border border-white/10 p-3 rounded-lg shadow-xl">
          <p className="text-gray-400 text-xs mb-1 font-medium">{label}</p>
          <p className="text-white font-bold text-sm">
            {payload[0].value} <span className="font-normal text-gray-400 text-xs">solved</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-gray-200 dark:border-white/10 pb-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Analytics</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Deep dive into your performance metrics and solving patterns.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:border-gray-300 dark:hover:border-white/20 transition-colors">
          <CardHeader>
            <CardTitle>Solving Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="_id" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#fafafa" 
                  strokeWidth={2} 
                  dot={{ fill: '#09090b', stroke: '#fafafa', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#fafafa', stroke: '#09090b', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover:border-gray-300 dark:hover:border-white/20 transition-colors">
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platforms} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="platform" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="solvedCount" fill="#3f3f46" radius={[4, 4, 0, 0]} maxBarSize={50} activeBar={{ fill: '#fafafa' }} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
