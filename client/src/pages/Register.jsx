import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Code2 } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.errors?.length > 0) {
        setError(err.response.data.errors[0].msg);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Registration failed');
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

      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Create your account</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Start tracking your competitive programming journey.</p>

      {error && (
        <div className="p-3 mb-6 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-100 dark:border-red-500/20 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username</label>
          <Input 
            type="text" 
            required 
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="johndoe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
          <Input 
            type="email" 
            required 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
          <Input 
            type="password" 
            required 
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" className="w-full mt-2" isLoading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-gray-900 dark:text-white hover:underline transition-all">
          Sign in
        </Link>
      </p>
    </div>
  );
}
