import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const UserDashboard = ({ isDarkMode = true }) => {
  const navigate = useNavigate();
  const { authUser, token, isAuthenticated } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyInput, setReplyInput] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [isAuthenticated, navigate, token]);

  const fetchMessages = async () => {
    try {
      const data = await api.getUserMessages(token);
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const handleSelectMessage = async (message) => {
    setSelectedMessage(message);
    if (!message.isRead && message.sender === 'admin') {
      try {
        await api.markMessageAsRead(message._id, token);
        setMessages(
          messages.map(m =>
            m._id === message._id ? { ...m, isRead: true } : m
          )
        );
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleSendReply = async () => {
    if (!replyInput.trim() || !selectedMessage) return;

    try {
      const newMessage = await api.sendUserReply(
        selectedMessage.storyId,
        replyInput,
        token
      );

      setMessages([...messages, newMessage]);
      setSelectedMessage(newMessage);
      setReplyInput('');
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} flex items-center justify-center pb-20`}>
        <p className={isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}>Redirecting...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} flex items-center justify-center pb-20`}>
        <p className={isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}>Loading your dashboard...</p>
      </div>
    );
  }

  const unreadCount = messages.filter(m => !m.isRead && m.sender === 'admin').length;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} pb-20`}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
          📨 Your Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* User Info */}
          <div className={`card p-4 lg:col-span-1 ${isDarkMode ? 'border border-dark-bg bg-dark-secondary' : 'border border-light-hover bg-light-secondary'}`}>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">
                  {authUser?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className={`font-bold ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
                {authUser?.email}
              </h2>
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
                Member since {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-dark-bg' : 'bg-light-hover'}`}>
              <div className={`text-center font-bold ${isDarkMode ? 'text-red-primary' : 'text-red-primary'}`}>
                {unreadCount}
              </div>
              <div className={`text-xs text-center ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
                Unread Messages
              </div>
            </div>
          </div>

          {/* Messages List */}
          <div className={`card lg:col-span-1 ${isDarkMode ? 'border border-dark-bg bg-dark-secondary' : 'border border-light-hover bg-light-secondary'} max-h-96 overflow-y-auto`}>
            <div className="p-4">
              <h2 className={`font-bold mb-3 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
                Messages
              </h2>

              {messages.length === 0 ? (
                <p className={`text-sm ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
                  No messages yet. Your posted stories may receive messages from admins.
                </p>
              ) : (
                <div className="space-y-2">
                  {messages.map(message => (
                    <div
                      key={message._id}
                      onClick={() => handleSelectMessage(message)}
                      className={`p-3 rounded-lg cursor-pointer transition ${
                        selectedMessage?._id === message._id
                          ? isDarkMode
                            ? 'bg-red-primary text-white'
                            : 'bg-red-primary text-white'
                          : isDarkMode
                            ? `bg-dark-bg hover:bg-dark-hover ${!message.isRead && message.sender === 'admin' ? 'border-l-2 border-red-primary' : ''}`
                            : `bg-light-hover hover:bg-light-secondary ${!message.isRead && message.sender === 'admin' ? 'border-l-2 border-red-primary' : ''}`
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="text-xs font-medium">
                          {message.sender === 'admin' ? '👨‍💼 Admin' : '👤 You'}
                        </div>
                        {!message.isRead && message.sender === 'admin' && (
                          <span className="inline-block w-2 h-2 bg-red-primary rounded-full"></span>
                        )}
                      </div>
                      <div className={`text-xs mt-1 line-clamp-2 ${selectedMessage?._id === message._id ? 'text-white' : isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Detail */}
          {selectedMessage && (
            <div className={`card p-6 lg:col-span-2 ${isDarkMode ? 'border border-dark-bg bg-dark-secondary' : 'border border-light-hover bg-light-secondary'}`}>
              <div className="space-y-4">
                <div>
                  <div className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
                    {selectedMessage.sender === 'admin' ? '👨‍💼 From Admin' : '👤 Your Message'}
                  </div>
                  <p className={`${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
                    {selectedMessage.content}
                  </p>
                </div>

                <div className={`text-xs ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </div>

                {selectedMessage.sender === 'admin' && (
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-dark-bg border border-red-primary' : 'bg-light-hover border border-red-primary'}`}>
                    <p className={`text-xs mb-3 ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
                      Reply to Admin
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                        placeholder="Type your reply..."
                        className={`input-field text-sm flex-1 py-2 ${isDarkMode ? '' : 'light-mode'}`}
                      />
                      <button
                        onClick={handleSendReply}
                        className="btn-primary text-sm px-3"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className={`card p-6 mt-6 ${isDarkMode ? 'border border-dark-bg bg-dark-secondary' : 'border border-light-hover bg-light-secondary'}`}>
          <h3 className={`font-bold mb-3 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
            💡 About Your Dashboard
          </h3>
          <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
            <li>• You'll receive messages from admins regarding your posted stories</li>
            <li>• Messages may contain feedback, advisory, or boost notifications</li>
            <li>• You can reply to admin messages directly from here</li>
            <li>• Your anonymity is still protected - only emails are used for admin communication</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
