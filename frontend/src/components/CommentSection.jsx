import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import api from '../services/api';

export const CommentSection = ({ storyId, comments, onCommentAdded }) => {
  const { user } = useContext(UserContext);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [displayComments, setDisplayComments] = useState(comments);

  const handleAddComment = async (e) => {
    e.preventDefault();
    setError('');

    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (newComment.length > 1000) {
      setError('Comment cannot exceed 1000 characters');
      return;
    }

    setLoading(true);

    try {
      const addedComment = await api.addComment(storyId, {
        username: user.username,
        content: newComment
      });

      setDisplayComments([addedComment, ...displayComments]);
      setNewComment('');
      onCommentAdded();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diff = (now - created) / 1000;

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-text-light mb-4">Advice & Support</h3>

      <form onSubmit={handleAddComment} className="mb-6">
        <textarea
          placeholder="Share your advice or support... (max 1000 characters)"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="3"
          className="input-field resize-none mb-3"
        />

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className="space-y-4">
        {displayComments.map(comment => (
          <div key={comment._id} className="card p-4 border border-dark-bg">
            <div className="flex justify-between items-start mb-2">
              <p className="text-text-grey text-sm">@{comment.username}</p>
              <p className="text-text-grey text-xs">{formatDate(comment.createdAt)}</p>
            </div>
            <p className="text-text-light">{comment.content}</p>
          </div>
        ))}

        {displayComments.length === 0 && (
          <p className="text-text-grey text-center py-8">No comments yet. Be the first to share advice!</p>
        )}
      </div>
    </div>
  );
};
