import React from 'react';
import { Link } from 'react-router-dom';

export const StoryCard = ({ story, onReact }) => {
  const truncateText = (text, maxLength = 150) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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

  const totalReactions = story.reactions.relate + story.reactions.helpful + story.reactions.support + story.reactions.emotional;

  return (
    <Link to={`/story/${story._id}`}>
      <div className="card p-6 hover:shadow-xl transition duration-200 cursor-pointer border border-dark-bg hover:border-red-primary">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-text-grey text-sm">@{story.username}</p>
            <p className="text-text-grey text-xs">{formatDate(story.createdAt)}</p>
          </div>
          <span className="emotion-badge text-xs">{story.emotion}</span>
        </div>

        <h3 className="text-lg font-semibold text-text-light mb-2 line-clamp-2">{story.title}</h3>
        <p className="text-text-grey mb-4 line-clamp-3">{truncateText(story.content)}</p>

        <div className="flex gap-4 text-sm text-text-grey">
          <div className="flex items-center gap-1">
            <span>❤️</span>
            <span>{story.reactions.relate}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>💡</span>
            <span>{story.reactions.helpful}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🤝</span>
            <span>{story.reactions.support}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>😢</span>
            <span>{story.reactions.emotional}</span>
          </div>
          <div className="ml-auto">💬 {totalReactions}</div>
        </div>
      </div>
    </Link>
  );
};
