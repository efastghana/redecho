import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export const Profile = ({ isDarkMode = true }) => {
  const { user } = useContext(UserContext);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} pb-20`}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
          Profile
        </h1>

        <div className={`card p-6 ${isDarkMode ? 'border border-dark-bg bg-dark-secondary' : 'border border-light-hover bg-light-secondary'}`}>
          <div className="text-center">
            <div className="w-20 h-20 bg-red-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">👤</span>
            </div>
            <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
              @{user.username}
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
              Anonymous storyteller since {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-dark-bg' : 'bg-light-hover'}`}>
              <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
                Your Stats
              </h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-red-primary' : 'text-red-primary'}`}>0</div>
                  <div className={`text-sm ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>Stories</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-red-primary' : 'text-red-primary'}`}>0</div>
                  <div className={`text-sm ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>Reactions</div>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-dark-bg' : 'bg-light-hover'}`}>
              <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
                About RedEcho
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
                A safe space for anonymous storytelling. Share your experiences, connect with others,
                and find comfort in knowing you're not alone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};