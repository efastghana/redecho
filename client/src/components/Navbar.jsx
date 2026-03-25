import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = ({ user, isDarkMode = true, onToggleTheme }) => {
  return (
    <nav className={`${isDarkMode ? 'bg-dark-secondary border-dark-bg' : 'bg-light-secondary border-light-hover'} border-b shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-red-primary">🔴</div>
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>RedEcho</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-lg ${isDarkMode ? 'bg-dark-bg hover:bg-dark-hover' : 'bg-light-hover hover:bg-light-secondary'} transition-colors`}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <div className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-dark-bg border-text-grey' : 'bg-light-secondary border-light-hover'}`}>
              <span className={`text-sm ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>@</span>
              <span className={`text-sm ml-1 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>{user?.username}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
