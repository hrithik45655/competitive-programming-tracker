import React from 'react';
import { Outlet, NavLink, Link, Navigate } from 'react-router-dom';
import { LayoutDashboard, List, CalendarCheck, BarChart2, Lightbulb, LogOut, Sun, Moon, Hexagon, Code2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function MainLayout() {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-gray-100">
        <div className="flex flex-col items-center gap-4">
          <Code2 className="h-8 w-8 animate-pulse text-gray-400" />
          <p className="text-sm font-medium text-gray-500">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/problems', icon: List, label: 'Problems' },
    { path: '/revisions', icon: CalendarCheck, label: 'Revisions' },
    { path: '/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/recommendations', icon: Lightbulb, label: 'Recommendations' },
  ];

  return (
    <div className="flex h-screen bg-white dark:bg-[#09090b] font-sans selection:bg-indigo-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#09090b] flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-transparent dark:border-transparent">
          <div className="flex items-center gap-2.5 text-gray-900 dark:text-white">
            <div className="p-1.5 bg-gray-900 dark:bg-white rounded-md">
              <Code2 className="h-4 w-4 text-white dark:text-gray-900" />
            </div>
            <h1 className="text-sm font-bold tracking-wide">CPTracker</h1>
          </div>
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-1 px-3">
          <div className="px-3 mb-2 text-[11px] font-bold tracking-widest text-gray-400 dark:text-gray-500 uppercase">Workspace</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-0' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5'
                }`
              }
            >
              <item.icon className={`h-4 w-4 transition-colors ${'group-hover:text-gray-900 dark:group-hover:text-white'}`} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4">
          <Link to="/profile" className="flex items-center gap-3 mb-4 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-800 to-gray-600 dark:from-white/20 dark:to-white/10 flex items-center justify-center text-white font-bold text-xs shadow-inner ring-1 ring-white/10">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 truncate">{user.email}</p>
            </div>
          </Link>
          
          <div className="flex items-center justify-between px-3">
            <button onClick={toggleTheme} className="p-2 rounded-md text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-white/10 transition-colors" title="Toggle Theme">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={logout} className="p-2 rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors" title="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-white dark:bg-[#09090b]">
        <div className="max-w-6xl mx-auto p-6 md:p-10 lg:p-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
