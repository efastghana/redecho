import React, { useState, useEffect } from 'react';
import { StoryCard } from '../components/StoryCard';
import api from '../services/api';

export const Trending = ({ isDarkMode = true }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrendingStories();
  }, []);

  const fetchTrendingStories = async () => {
    try {
      const allStories = await api.fetchStories();

      // Sort by total reactions (most engaged first)
      const sortedStories = allStories
        .map(story => ({
          ...story,
          totalReactions: story.reactions.relate + story.reactions.helpful + story.reactions.support + story.reactions.emotional
        }))
        .sort((a, b) => b.totalReactions - a.totalReactions)
        .slice(0, 20); // Top 20 trending

      setStories(sortedStories);
    } catch (err) {
      setError('Failed to load trending stories');
      console.error('Trending error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} flex items-center justify-center pb-20`}>
      <p className={isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}>Loading trending stories...</p>
    </div>
  );

  if (error) return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} flex items-center justify-center pb-20`}>
      <div className="text-center">
        <p className="text-red-primary mb-4">{error}</p>
        <button
          onClick={fetchTrendingStories}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} pb-20`}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
          🔥 Trending Stories
        </h1>

        {stories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📈</div>
            <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
              No Trending Stories Yet
            </h2>
            <p className={isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}>
              Stories with the most reactions will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map((story, index) => (
              <div key={story._id} className="relative">
                {index < 3 && (
                  <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                    index === 0 ? 'bg-yellow-500 text-black' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    'bg-orange-600 text-white'
                  }`}>
                    {index + 1}
                  </div>
                )}
                <StoryCard
                  story={story}
                  isDarkMode={isDarkMode}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};