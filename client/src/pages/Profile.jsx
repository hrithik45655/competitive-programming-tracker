import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { User, Mail, LogOut, Shield } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-gray-200 dark:border-white/10 pb-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Profile & Settings</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences and settings.</p>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100 dark:border-white/5 pb-4">
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4 text-indigo-500" /> Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-inner ring-4 ring-gray-50 dark:ring-white/5">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user?.username}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                <Mail className="h-3.5 w-3.5" /> {user?.email}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-md w-fit">
                <Shield className="h-3 w-3" /> Free Plan
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-900/30">
        <CardHeader className="border-b border-red-100 dark:border-red-900/20 pb-4">
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Sign out</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                Securely sign out of your account on this device.
              </p>
            </div>
            <Button variant="danger" onClick={logout} className="flex items-center gap-2 w-full sm:w-auto">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
