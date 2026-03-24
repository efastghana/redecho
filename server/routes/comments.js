const express = require('express');
const Comment = require('../models/Comment');
const { filterProfanity } = require('../middleware/moderation');

const router = express.Router();

// GET comments for story
router.get('/:storyId', async (req, res) => {
  try {
    const comments = await Comment.find({ storyId: req.params.storyId })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST comment to story
router.post('/:storyId', async (req, res) => {
  try {
    const { username, content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    if (content.length > 1000) {
      return res.status(400).json({ error: 'Comment exceeds 1000 character limit' });
    }

    const filteredContent = filterProfanity(content);

    const comment = new Comment({
      storyId: req.params.storyId,
      username,
      content: filteredContent
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
