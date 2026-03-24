import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = ({ user }) => {
  return (
    <nav className="bg-dark-secondary border-b border-dark-bg shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-red-primary">🔴</div>
            <span className="text-2xl font-bold text-text-light">RedEcho</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-dark-bg rounded-lg border border-text-grey">
              <span className="text-sm text-text-grey">@</span>
              <span className="text-sm text-text-light ml-1">{user?.username}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
