const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  reactionType: {
    type: String,
    enum: ['relate', 'helpful', 'support', 'emotional'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure only one reaction per user per story
reactionSchema.index({ storyId: 1, username: 1 }, { unique: true });

module.exports = mongoose.model('Reaction', reactionSchema);
