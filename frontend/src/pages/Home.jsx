import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { StoryCard } from '../components/StoryCard';
import { StoryForm } from '../components/StoryForm';
import api from '../services/api';

export const Home = () => {
  const { user } = useContext(UserContext);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStories();
  }, []);

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
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-text-light mb-2">RedEcho</h1>
          <p className="text-text-grey">Share your stories. Stay anonymous. Find support.</p>
        </div>

        {user && <StoryForm onStoryCreated={handleStoryCreated} />}

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-text-grey">Loading stories...</div>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-grey text-lg">No stories yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map(story => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
