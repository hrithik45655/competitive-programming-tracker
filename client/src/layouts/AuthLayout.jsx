import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2 } from 'lucide-react';

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#09090b]">
        <Code2 className="h-8 w-8 animate-pulse text-gray-400" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#09090b] selection:bg-indigo-500/30">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-[360px]">
          <Outlet />
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1 bg-gray-900 dark:bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-black to-black opacity-80" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        
        {/* Subtle grid overlay for developer feel */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
    </div>
  );
}
