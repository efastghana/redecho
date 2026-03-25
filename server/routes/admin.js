const express = require('express');
const jwt = require('jsonwebtoken');
const Story = require('../models/Story');
const User = require('../models/User');
const Message = require('../models/Message');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify admin
const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get metrics
router.get('/metrics', verifyAdmin, async (req, res) => {
  try {
    const totalStories = await Story.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalReactions = await Story.aggregate([
      {
        $group: {
          _id: null,
          relate: { $sum: '$reactions.relate' },
          helpful: { $sum: '$reactions.helpful' },
          support: { $sum: '$reactions.support' },
          emotional: { $sum: '$reactions.emotional' }
        }
      }
    ]);

    const topStories = await Story.find()
      .sort({
        'reactions.relate': -1,
        'reactions.helpful': -1,
        'reactions.support': -1,
        'reactions.emotional': -1
      })
      .limit(10);

    const totalReactionCount = totalReactions[0] || {
      relate: 0,
      helpful: 0,
      support: 0,
      emotional: 0
    };

    res.json({
      totalStories,
      totalUsers,
      totalReactions: {
        relate: totalReactionCount.relate,
        helpful: totalReactionCount.helpful,
        support: totalReactionCount.support,
        emotional: totalReactionCount.emotional,
        total:
          totalReactionCount.relate +
          totalReactionCount.helpful +
          totalReactionCount.support +
          totalReactionCount.emotional
      },
      topStories
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all stories for moderation
router.get('/stories', verifyAdmin, async (req, res) => {
  try {
    const stories = await Story.find()
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete story
router.delete('/stories/:id', verifyAdmin, async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit story
router.put('/stories/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, content, emotion, moderationNotes } = req.body;
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...(title !== undefined && { title }),
          ...(content !== undefined && { content }),
          ...(emotion !== undefined && { emotion }),
          ...(moderationNotes !== undefined && { moderationNotes })
        }
      },
      { new: true }
    );

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Boost/unboost story
router.patch('/stories/:id/boost', verifyAdmin, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    story.isBoosted = !story.isBoosted;
    await story.save();

    res.json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message to user
router.post('/messages', verifyAdmin, async (req, res) => {
  try {
    const { storyId, storyAuthor, content } = req.body;

    if (!storyId || !storyAuthor || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const message = new Message({
      storyId,
      storyAuthor,
      sender: 'admin',
      content
    });

    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a story
router.get('/messages/:storyId', verifyAdmin, async (req, res) => {
  try {
    const messages = await Message.find({ storyId: req.params.storyId })
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
