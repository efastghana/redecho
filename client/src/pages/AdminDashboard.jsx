import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const AdminDashboard = ({ isDarkMode = true }) => {
  const navigate = useNavigate();
  const { authUser, token, isAdmin } = useContext(AuthContext);
  const [metrics, setMetrics] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [editingStory, setEditingStory] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }

    fetchData();
  }, [isAdmin, navigate, token]);

  const fetchData = async () => {
    try {
      const [metricsData, storiesData] = await Promise.all([
        api.getAdminMetrics(token),
        api.getAdminStories(token)
      ]);

      setMetrics(metricsData);
      setStories(storiesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStory = async (story) => {
    setSelectedStory(story);
    try {
      const msgs = await api.getAdminMessages(story._id, token);
      setMessages(msgs);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedStory) return;

    try {
      const newMessage = await api.sendAdminMessage(
        selectedStory._id,
        selectedStory.username,
        messageInput,
        token
      );

      setMessages([...messages, newMessage]);
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await api.deleteStory(storyId, token);
        setStories(stories.filter(s => s._id !== storyId));
        if (selectedStory?._id === storyId) {
          setSelectedStory(null);
          setMessages([]);
        }
      } catch (error) {
        console.error('Error deleting story:', error);
      }
    }
  };

  const handleBoostStory = async (storyId) => {
    try {
      const updated = await api.boostStory(storyId, token);
      setStories(stories.map(s => s._id === storyId ? updated : s));
      if (selectedStory?._id === storyId) {
        setSelectedStory(updated);
      }
    } catch (error) {
      console.error('Error boosting story:', error);
    }
  };

  const handleEditStory = async () => {
    if (!editingStory) return;

    try {
      const updated = await api.editStory(editingStory._id, editingStory, token);
      setStories(stories.map(s => s._id === updated._id ? updated : s));
      setSelectedStory(updated);
      setEditingStory(null);
    } catch (error) {
      console.error('Error editing story:', error);
    }
  };

  if (!isAdmin) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} flex items-center justify-center pb-20`}>
        <p className={isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}>Redirecting...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} flex items-center justify-center pb-20`}>
        <p className={isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} pb-20`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
          ⚙️ Admin Dashboard
        </h1>

        {/* Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={`card p-4 ${isDarkMode ? 'border border-dark-bg bg-dark-secondary' : 'border border-light-hover bg-light-secondary'}`}>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-red-primary' : 'text-red-primary'}`}>
                {metrics.totalStories}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
                Total Stories
              </div>
            </div>

            <div className={`card p-4 ${isDarkMode ? 'border border-dark-bg bg-dark-secondary' : 'border border-light-hover bg-light-secondary'}`}>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-red-primary' : 'text-red-primary'}`}>
                {metrics.totalUsers}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
                Total Users
              </div>
            </div>

            <div className={`card p-4 ${isDarkMode ? 'border border-dark-bg bg-dark-secondary' : 'border border-light-hover bg-light-secondary'}`}>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-red-primary' : 'text-red-primary'}`}>
                {metrics.totalReactions.total}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
                Total Reactions
              </div>
            </div>

            <div className={`card p-4 ${isDarkMode ? 'border border-dark-bg bg-dark-secondary' : 'border border-light-hover bg-light-secondary'}`}>
              <div className="space-y-1 text-xs">
                <div>❤️ {metrics.totalReactions.relate}</div>
                <div>💡 {metrics.totalReactions.helpful}</div>
                <div>🤝 {metrics.totalReactions.support}</div>
                <div>😢 {metrics.totalReactions.emotional}</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stories List */}
          <div className={`card p-4 lg:col-span-1 ${isDarkMode ? 'border border-dark-bg bg-dark-secondary' : 'border border-light-hover bg-light-secondary'} max-h-96 overflow-y-auto`}>
            <h2 className={`font-bold mb-4 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
              Stories to Moderate
            </h2>
            <div className="space-y-2">
              {stories.length === 0 ? (
                <p className={`text-sm ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
                  No stories to moderate
                </p>
              ) : (
                stories.map(story => (
                  <div
                    key={story._id}
                    onClick={() => handleSelectStory(story)}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      selectedStory?._id === story._id
                        ? isDarkMode
                          ? 'bg-red-primary text-white'
                          : 'bg-red-primary text-white'
                        : isDarkMode
                          ? 'bg-dark-bg hover:bg-dark-hover'
                          : 'bg-light-hover hover:bg-light-secondary'
                    }`}
                  >
                    <div className="text-xs font-medium">
                      {story.isBoosted && '🔥 '}
                      {story.title || 'Untitled'}
                    </div>
                    <div className={`text-xs ${selectedStory?._id === story._id ? 'text-white' : isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
                      @{story.username}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Story Detail */}
          {selectedStory && (
            <div className={`card p-6 lg:col-span-2 ${isDarkMode ? 'border border-dark-bg bg-dark-secondary' : 'border border-light-hover bg-light-secondary'}`}>
              {editingStory ? (
                <div className="space-y-4">
                  <h3 className={`font-bold ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
                    Edit Story
                  </h3>

                  <div>
                    <label className={`text-sm block mb-1 ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={editingStory.title}
                      onChange={(e) =>
                        setEditingStory({ ...editingStory, title: e.target.value })
                      }
                      className={`input-field text-sm ${isDarkMode ? '' : 'light-mode'}`}
                    />
                  </div>

                  <div>
                    <label className={`text-sm block mb-1 ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
                      Content
                    </label>
                    <textarea
                      value={editingStory.content}
                      onChange={(e) =>
                        setEditingStory({ ...editingStory, content: e.target.value })
                      }
                      rows={4}
                      className={`input-field text-sm resize-none ${isDarkMode ? '' : 'light-mode'}`}
                    />
                  </div>

                  <div>
                    <label className={`text-sm block mb-1 ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
                      Moderation Notes
                    </label>
                    <textarea
                      value={editingStory.moderationNotes}
                      onChange={(e) =>
                        setEditingStory({ ...editingStory, moderationNotes: e.target.value })
                      }
                      rows={2}
                      placeholder="Add notes about this story..."
                      className={`input-field text-sm resize-none ${isDarkMode ? '' : 'light-mode'}`}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleEditStory}
                      className="btn-primary text-sm flex-1"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingStory(null)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        isDarkMode
                          ? 'bg-dark-bg hover:bg-dark-hover text-text-light'
                          : 'bg-light-hover hover:bg-light-secondary text-text-dark'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Story Details */}
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className={`font-bold text-lg ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
                        {selectedStory.title || 'Untitled'}
                      </h2>
                      {selectedStory.isBoosted && <span className="text-xl">🔥</span>}
                    </div>
                    <p className={`text-xs mb-4 ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
                      By @{selectedStory.username} • {selectedStory.emotion}
                    </p>
                    <p className={`mb-4 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
                      {selectedStory.content}
                    </p>

                    {selectedStory.moderationNotes && (
                      <div className={`p-3 rounded-lg text-sm ${isDarkMode ? 'bg-dark-bg' : 'bg-light-hover'}`}>
                        <strong>Notes:</strong> {selectedStory.moderationNotes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setEditingStory({...selectedStory})}
                      className="btn-primary text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleBoostStory(selectedStory._id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        selectedStory.isBoosted
                          ? 'bg-red-primary text-white hover:bg-red-700'
                          : isDarkMode
                            ? 'bg-dark-bg hover:bg-dark-hover text-text-light'
                            : 'bg-light-hover hover:bg-light-secondary text-text-dark'
                      }`}
                    >
                      {selectedStory.isBoosted ? '⬇️ Unboost' : '🔥 Boost'}
                    </button>
                    <button
                      onClick={() => handleDeleteStory(selectedStory._id)}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-red-900 hover:bg-red-700 text-white transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>

                  {/* Messages */}
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-dark-bg' : 'bg-light-hover'}`}>
                    <h3 className={`font-bold mb-2 text-sm ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
                      Messages ({messages.length})
                    </h3>

                    <div className={`space-y-2 mb-3 max-h-32 overflow-y-auto ${isDarkMode ? 'bg-dark-secondary' : 'bg-light-secondary'} p-2 rounded`}>
                      {messages.map(msg => (
                        <div
                          key={msg._id}
                          className={`text-xs p-2 rounded ${
                            msg.sender === 'admin'
                              ? isDarkMode
                                ? 'bg-red-primary text-white'
                                : 'bg-red-primary text-white'
                              : isDarkMode
                                ? 'bg-dark-bg text-text-light'
                                : 'bg-light-hover text-text-dark'
                          }`}
                        >
                          <strong>{msg.sender === 'admin' ? 'Admin' : 'User'}:</strong> {msg.content}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Send advisory message..."
                        className={`input-field text-sm flex-1 py-2 ${isDarkMode ? '' : 'light-mode'}`}
                      />
                      <button
                        onClick={handleSendMessage}
                        className="btn-primary text-sm px-3"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
