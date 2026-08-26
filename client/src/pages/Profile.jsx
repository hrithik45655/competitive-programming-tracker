import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Profile() {
  const { user, logout } = useAuth();
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">User Profile</h2>
        <p className="text-gray-500 dark:text-gray-400">Manage your account settings.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 dark:text-gray-300">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white dark:border-gray-800 shadow-sm">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-xl">{user?.username}</p>
              <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
            </div>
          </div>
          
          <div className="border-t dark:border-gray-800 pt-6">
            <h3 className="font-medium mb-4">Account Actions</h3>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => alert('Password reset flow would trigger here')}>Reset Password</Button>
              <Button variant="danger" onClick={logout}>Sign Out</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
