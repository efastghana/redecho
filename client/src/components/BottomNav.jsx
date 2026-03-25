import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const BottomNav = ({ isDarkMode = true }) => {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      icon: '🏠',
      label: 'Home',
      active: location.pathname === '/'
    },
    {
      path: '/search',
      icon: '🔍',
      label: 'Search',
      active: location.pathname === '/search'
    },
    {
      path: '/create',
      icon: '➕',
      label: 'Post',
      active: location.pathname === '/create',
      isCenter: true
    },
    {
      path: '/trending',
      icon: '🔥',
      label: 'Trending',
      active: location.pathname === '/trending'
    },
    {
      path: '/profile',
      icon: '👤',
      label: 'Profile',
      active: location.pathname === '/profile'
    }
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-dark-secondary border-t border-dark-bg' : 'bg-light-secondary border-t border-light-hover'} z-50`}>
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
              item.isCenter
                ? 'bg-red-primary text-white shadow-lg hover:bg-red-700 scale-110 -mt-4 rounded-full w-14 h-14'
                : item.active
                  ? isDarkMode
                    ? 'text-red-primary bg-dark-bg'
                    : 'text-red-primary bg-light-hover'
                  : isDarkMode
                    ? 'text-text-grey hover:text-text-light hover:bg-dark-bg'
                    : 'text-text-dark-grey hover:text-text-dark hover:bg-light-hover'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {!item.isCenter && (
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};