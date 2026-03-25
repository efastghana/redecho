const express = require('express');
const mongoose = require('mongoose');
const Reaction = require('../models/Reaction');
const Story = require('../models/Story');

const router = express.Router();

// POST reaction to story
router.post('/', async (req, res) => {
  try {
    const { storyId, username, reactionType } = req.body;

    if (!['relate', 'helpful', 'support', 'emotional'].includes(reactionType)) {
      return res.status(400).json({ error: 'Invalid reaction type' });
    }

    // Check if user already reacted
    let existingReaction = await Reaction.findOne({
      storyId,
      username
    });

    if (existingReaction) {
      // Update existing reaction
      existingReaction.reactionType = reactionType;
      await existingReaction.save();
    } else {
      // Create new reaction
      existingReaction = new Reaction({
        storyId,
        username,
        reactionType
      });
      await existingReaction.save();
    }

    // Update story reaction count
    const story = await Story.findById(storyId);
    
    // Reset all reaction counts and recalculate
    story.reactions.relate = 0;
    story.reactions.helpful = 0;
    story.reactions.support = 0;
    story.reactions.emotional = 0;

    // Count reactions manually
    const relateCount = await Reaction.countDocuments({ storyId, reactionType: 'relate' });
    const helpfulCount = await Reaction.countDocuments({ storyId, reactionType: 'helpful' });
    const supportCount = await Reaction.countDocuments({ storyId, reactionType: 'support' });
    const emotionalCount = await Reaction.countDocuments({ storyId, reactionType: 'emotional' });

    story.reactions.relate = relateCount;
    story.reactions.helpful = helpfulCount;
    story.reactions.support = supportCount;
    story.reactions.emotional = emotionalCount;

    await story.save();
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
