import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { CommentSection } from '../components/CommentSection';
import api from '../services/api';

export const StoryDetails = ({ isDarkMode = true }) => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [story, setStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userReactions, setUserReactions] = useState({});
  const [reactingTo, setReactingTo] = useState(null);

  useEffect(() => {
    fetchStory();
    fetchComments();
    loadUserReactions();
  }, [id]);

  const fetchStory = async () => {
    try {
      const data = await api.fetchStoryById(id);
      setStory(data);
    } catch (err) {
      setError('Failed to load story');
      console.error('Error fetching story:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await api.fetchComments(id);
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const loadUserReactions = () => {
    const stored = localStorage.getItem(`reactions_${id}`);
    if (stored) {
      setUserReactions(JSON.parse(stored));
    }
  };

  const handleReact = async (reactionType) => {
    try {
      setReactingTo(reactionType);
      // Update UI immediately for responsiveness
      const newReactions = { ...userReactions, [reactionType]: true };
      setUserReactions(newReactions);

      const updatedStory = await api.addReaction({
        storyId: id,
        username: user.username,
        reactionType
      });

      setStory(updatedStory);
      localStorage.setItem(`reactions_${id}`, JSON.stringify(newReactions));
    } catch (err) {
      console.error('Error adding reaction:', err);
      // Revert on error
      const currentReactions = { ...userReactions };
      delete currentReactions[reactionType];
      setUserReactions(currentReactions);
    } finally {
      setReactingTo(null);
    }
  };

  const reactions = [
    { type: 'relate', emoji: '❤️', label: 'Relate' },
    { type: 'helpful', emoji: '💡', label: 'Helpful' },
    { type: 'support', emoji: '🤝', label: 'Support' },
    { type: 'emotional', emoji: '😢', label: 'Emotional' }
  ];

  if (loading) return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} flex items-center justify-center`}>
      <p className={isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}>Loading story...</p>
    </div>
  );

  if (error) return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} flex items-center justify-center`}>
      <div className="text-center">
        <p className="text-red-primary mb-4">{error}</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    </div>
  );

  if (!story) return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} flex items-center justify-center`}>
      <p className={isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}>Story not found</p>
    </div>
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} pb-20`}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/" className="text-red-primary hover:text-red-700 mb-6 inline-block">← Back to Stories</Link>

        <div className={`card p-8 ${isDarkMode ? 'border border-dark-bg bg-dark-secondary' : 'border border-light-hover bg-light-secondary'}`}>
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className={`text-sm mb-1 ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>@{story.username}</p>
                <p className={`text-xs ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>{formatDate(story.createdAt)}</p>
              </div>
              <span className={`emotion-badge ${isDarkMode ? '' : 'bg-red-primary text-white'}`}>{story.emotion}</span>
            </div>

            <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>{story.title}</h1>
            <p className={`leading-relaxed text-lg whitespace-pre-wrap ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>{story.content}</p>
          </div>

          <div className={`border-t pt-6 ${isDarkMode ? 'border-dark-bg' : 'border-light-hover'}`}>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>React to this story:</p>
            <div className="flex flex-wrap gap-3">
              {reactions.map(reaction => (
                <button
                  key={reaction.type}
                  onClick={() => handleReact(reaction.type)}
                  disabled={reactingTo !== null}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                    userReactions[reaction.type]
                      ? 'bg-red-primary text-white shadow-lg hover:bg-red-700 scale-105'
                      : isDarkMode
                        ? 'bg-dark-secondary text-text-light hover:bg-dark-bg border border-text-grey hover:border-red-primary'
                        : 'bg-light-secondary text-text-dark hover:bg-light-hover border border-light-hover hover:border-red-primary'
                  }`}
                >
                  <span className="text-lg">{reaction.emoji}</span>
                  <span className="text-sm">{reaction.label}</span>
                  <span className="text-xs opacity-75">({story.reactions[reaction.type]})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <CommentSection
          storyId={id}
          comments={comments}
          onCommentAdded={fetchComments}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};
