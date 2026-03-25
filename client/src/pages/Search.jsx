import React, { useState, useEffect } from 'react';
import { StoryCard } from '../components/StoryCard';
import api from '../services/api';

export const Search = ({ isDarkMode = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (term) => {
    if (!term.trim()) {
      setStories([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const allStories = await api.fetchStories();
      const filteredStories = allStories.filter(story =>
        story.title.toLowerCase().includes(term.toLowerCase()) ||
        story.content.toLowerCase().includes(term.toLowerCase()) ||
        story.emotion.toLowerCase().includes(term.toLowerCase()) ||
        story.username.toLowerCase().includes(term.toLowerCase())
      );
      setStories(filteredStories);
    } catch (err) {
      setError('Failed to search stories');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} pb-20`}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
          Search Stories
        </h1>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title, content, emotion, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`input-field ${isDarkMode ? '' : 'light-mode'}`}
          />
        </div>

        {/* Results */}
        {loading && (
          <div className="text-center py-8">
            <p className={isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}>Searching...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-primary">{error}</p>
          </div>
        )}

        {!loading && !error && stories.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <p className={isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}>
              No stories found for "{searchTerm}"
            </p>
          </div>
        )}

        {!loading && stories.length > 0 && (
          <div className="space-y-4">
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
              Found {stories.length} result{stories.length !== 1 ? 's' : ''}
            </p>
            {stories.map(story => (
              <StoryCard
                key={story._id}
                story={story}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        )}

        {!searchTerm && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
              Search Stories
            </h2>
            <p className={isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}>
              Find stories by title, content, emotion, or author
            </p>
          </div>
        )}
      </div>
    </div>
  );
};