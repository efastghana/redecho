import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import api from '../services/api';

export const Create = ({ isDarkMode = true }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    emotion: 'Confession'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const emotions = ['Love', 'Pain', 'Anxiety', 'Confession', 'Happiness', 'Regret'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'content') {
      setCharCount(value.length);
      setWordCount(value.trim() ? value.trim().split(/\s+/).length : 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      setError('Please write your story');
      return;
    }

    if (formData.content.length > 4000) {
      setError('Story exceeds 4000 character limit');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const storyData = {
        ...formData,
        username: user.username
      };

      await api.createStory(storyData);
      navigate('/');
    } catch (err) {
      setError('Failed to post story. Please try again.');
      console.error('Create story error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} pb-20`}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
          Share Your Story
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
              Title (Optional)
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Give your story a title..."
              className={`input-field ${isDarkMode ? '' : 'light-mode'}`}
              maxLength={100}
            />
          </div>

          {/* Emotion */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
              How are you feeling?
            </label>
            <select
              name="emotion"
              value={formData.emotion}
              onChange={handleInputChange}
              className={`input-field ${isDarkMode ? '' : 'light-mode'}`}
            >
              {emotions.map(emotion => (
                <option key={emotion} value={emotion}>{emotion}</option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
              Your Story
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Share your anonymous story here..."
              rows={8}
              className={`input-field resize-none ${isDarkMode ? '' : 'light-mode'}`}
              maxLength={4000}
              required
            />
            <div className={`flex justify-between text-xs mt-2 ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
              <span>{wordCount} words</span>
              <span>{charCount}/4000 characters</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-primary text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Share Story'}
          </button>
        </form>

        {/* Tips */}
        <div className={`mt-8 p-4 rounded-lg ${isDarkMode ? 'bg-dark-secondary' : 'bg-light-secondary border border-light-hover'}`}>
          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
            💡 Writing Tips
          </h3>
          <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
            <li>• Your story is completely anonymous</li>
            <li>• Be honest and authentic - that's what makes stories powerful</li>
            <li>• Choose an emotion that best represents how you feel</li>
            <li>• You can always edit or delete your story later</li>
          </ul>
        </div>
      </div>
    </div>
  );
};