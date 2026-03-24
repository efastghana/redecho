const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Untitled'
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  emotion: {
    type: String,
    enum: ['Love', 'Pain', 'Anxiety', 'Confession', 'Happiness', 'Regret'],
    default: 'Confession'
  },
  reactions: {
    relate: { type: Number, default: 0 },
    helpful: { type: Number, default: 0 },
    support: { type: Number, default: 0 },
    emotional: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Story', storySchema);
