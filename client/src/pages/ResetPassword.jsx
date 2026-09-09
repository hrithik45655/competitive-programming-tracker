import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Code2 } from 'lucide-react';
import api from '../services/api';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response?.data?.errors?.length > 0) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError(err.response?.data?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-1.5 bg-gray-900 dark:bg-white rounded-lg shadow-sm">
          <Code2 className="h-5 w-5 text-white dark:text-gray-900" />
        </div>
        <span className="font-bold tracking-wide text-gray-900 dark:text-white">CPTracker</span>
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Set New Password</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Enter your new password below.</p>

      {error && (
        <div className="p-3 mb-6 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-100 dark:border-red-500/20 font-medium">
          {error}
        </div>
      )}
      
      {message && (
        <div className="p-3 mb-6 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 rounded-lg border border-green-100 dark:border-green-500/20 font-medium">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
          <Input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" className="w-full mt-2" isLoading={loading}>
          Reset Password
        </Button>
      </form>
    </div>
  );
}
