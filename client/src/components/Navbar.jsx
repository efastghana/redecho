import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Navbar = ({ user, isDarkMode = true, onToggleTheme }) => {
  const { authUser, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

            {authUser ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-sm font-medium text-red-primary hover:text-red-700"
                  >
                    ⚙️ Admin
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="text-sm font-medium px-3 py-1 rounded-lg bg-red-primary text-white hover:bg-red-700 transition"
                >
                  📨 Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className={`text-sm px-3 py-1 rounded-lg font-medium transition ${
                    isDarkMode
                      ? 'bg-dark-bg hover:bg-dark-hover text-text-light'
                      : 'bg-light-hover hover:bg-light-secondary text-text-dark'
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium px-4 py-2 rounded-lg bg-red-primary text-white hover:bg-red-700 transition"
              >
                Login / Sign Up
              </Link>
            )}

            {!authUser && (
              <div className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-dark-bg border-text-grey' : 'bg-light-secondary border-light-hover'}`}>
                <span className={`text-sm ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>@</span>
                <span className={`text-sm ml-1 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>{user?.username}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
