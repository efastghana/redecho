import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { StoryCard } from '../components/StoryCard';
import { StoryForm } from '../components/StoryForm';
import api from '../services/api';

export const Home = ({ isDarkMode = true }) => {
  const { user } = useContext(UserContext);
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    // Filter stories based on search term
    if (searchTerm.trim() === '') {
      setFilteredStories(stories);
    } else {
      const filtered = stories.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.emotion.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStories(filtered);
    }
  }, [stories, searchTerm]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const data = await api.fetchStories();
      setStories(data);
      setError('');
    } catch (err) {
      setError('Failed to load stories. Make sure the backend is running.');
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryCreated = (newStory) => {
    setStories([newStory, ...stories]);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} pb-20`}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>RedEcho</h1>
          <p className={isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}>Share your stories. Stay anonymous. Find support.</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search stories by title, content, or emotion..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full p-3 rounded-lg border ${
              isDarkMode
                ? 'bg-dark-secondary border-dark-hover text-text-light placeholder-text-grey'
                : 'bg-light-secondary border-light-hover text-text-dark placeholder-text-dark-grey'
            } focus:outline-none focus:ring-2 focus:ring-red-primary`}
          />
        </div>

        {user && <StoryForm onStoryCreated={handleStoryCreated} />}

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className={isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}>Loading stories...</div>
          </div>
        ) : filteredStories.length === 0 && searchTerm.trim() !== '' ? (
          <div className="text-center py-12">
            <p className={`text-lg ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
              No stories found matching "{searchTerm}"
            </p>
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-12">
            <p className={`text-lg ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>No stories yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStories.map(story => (
              <StoryCard key={story._id} story={story} isDarkMode={isDarkMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
