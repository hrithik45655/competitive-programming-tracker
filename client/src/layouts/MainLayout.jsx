import React from 'react';
import { Outlet, NavLink, Link, Navigate } from 'react-router-dom';
import { LayoutDashboard, List, CalendarCheck, BarChart2, Lightbulb, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function MainLayout() {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-gray-950 dark:text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/problems', icon: List, label: 'Problems' },
    { path: '/revisions', icon: CalendarCheck, label: 'Revisions' },
    { path: '/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/recommendations', icon: Lightbulb, label: 'Recommendations' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">CPTracker</h1>
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-gray-800 dark:text-indigo-400' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <Link to="/profile" className="flex items-center gap-3 mb-4 px-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.username}</p>
            </div>
          </Link>
          
          <div className="flex items-center justify-between px-2">
            <button onClick={toggleTheme} className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Toggle Theme">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={logout} className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800 dark:hover:text-red-400 transition-colors" title="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950 p-6">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
