import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">CPTracker</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Master your competitive programming journey</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
