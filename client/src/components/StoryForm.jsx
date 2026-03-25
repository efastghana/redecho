import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import api from '../services/api';

export const StoryForm = ({ onStoryCreated }) => {
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState('Confession');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const emotions = ['Love', 'Pain', 'Anxiety', 'Confession', 'Happiness', 'Regret'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('Story content is required');
      return;
    }

    if (content.length > 4000) {
      setError('Story cannot exceed 4000 characters');
      return;
    }

    setLoading(true);

    try {
      const newStory = await api.createStory({
        username: user.username,
        title: title || 'Untitled',
        content,
        emotion
      });

      setTitle('');
      setContent('');
      setEmotion('Confession');
      onStoryCreated(newStory);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 mb-8 border border-dark-bg">
      <h2 className="text-2xl font-bold text-text-light mb-4">Share Your Story</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-text-light text-sm font-medium mb-2">Title (optional)</label>
          <input
            type="text"
            placeholder="Give your story a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="mb-4">
          <label className="block text-text-light text-sm font-medium mb-2">Emotion</label>
          <select
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            className="input-field"
          >
            {emotions.map(em => (
              <option key={em} value={em} className="bg-dark-secondary">{em}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-text-light text-sm font-medium mb-2">
            Your Story ({content.length}/4000 chars, {content.trim() ? content.trim().split(/\s+/).length : 0} words)
          </label>
          <textarea
            placeholder="Share your story anonymously... (max 4000 characters)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            className="input-field resize-none"
          />
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Posting...' : 'Post Story'}
        </button>
      </form>
    </div>
  );
};
