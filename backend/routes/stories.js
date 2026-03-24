const express = require('express');
const Story = require('../models/Story');
const Comment = require('../models/Comment');
const Reaction = require('../models/Reaction');
const { filterProfanity, checkSpamLimit } = require('../middleware/moderation');

const router = express.Router();

// GET all stories
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single story
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new story
router.post('/', async (req, res) => {
  try {
    const { username, title, content, emotion } = req.body;

    // Validation
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Story content is required' });
    }

    if (content.length > 2000) {
      return res.status(400).json({ error: 'Story exceeds 2000 character limit' });
    }

    // Spam check
    if (!checkSpamLimit(username)) {
      return res.status(429).json({ error: 'Please wait 30 seconds before posting again' });
    }

    // Filter profanity
    const filteredContent = filterProfanity(content);
    const filteredTitle = filterProfanity(title || 'Untitled');

    const story = new Story({
      username,
      title: filteredTitle,
      content: filteredContent,
      emotion: emotion || 'Confession'
    });

    await story.save();
    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
