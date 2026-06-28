import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  
  // Safely pull the user data to display their name and role
  const userString = localStorage.getItem('kpi_user');
  const user = userString ? JSON.parse(userString) : { username: 'Staff', role: 'UNKNOWN' };

  const handleLogout = () => {
    // Destroy the security tokens
    localStorage.removeItem('kpi_token');
    localStorage.removeItem('kpi_user');
    // Boot them back to the login screen
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-300">
      {/* Global Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold tracking-widest uppercase text-white">
            Randaframes <span className="text-zinc-500">HQ</span>
          </h1>
          <span className="hidden md:inline-block px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-400">
            {user.role} PORTAL
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <p className="text-sm font-medium text-zinc-400">
            Logged in as <span className="text-white">{user.username}</span>
          </p>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/10 text-red-400 text-sm font-medium rounded-lg border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-colors"
          >
            End Session
          </button>
        </div>
      </header>

      {/* Main Dashboard Content renders here */}
      <main className="w-full h-full">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;