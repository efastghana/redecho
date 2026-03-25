const express = require('express');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify user
const verifyUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get messages for authenticated user (their story)
router.get('/', verifyUser, async (req, res) => {
  try {
    const messages = await Message.find({ storyAuthor: req.user.email })
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send reply to admin
router.post('/', verifyUser, async (req, res) => {
  try {
    const { storyId, content } = req.body;

    if (!storyId || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const message = new Message({
      storyId,
      storyAuthor: req.user.email,
      sender: 'user',
      content
    });

    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark message as read
router.patch('/:id/read', verifyUser, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { $set: { isRead: true } },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
