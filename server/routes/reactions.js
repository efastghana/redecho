const express = require('express');
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

    const reactionCounts = await Reaction.aggregate([
      { $match: { storyId: new mongoose.Types.ObjectId(storyId) } },
      { $group: { _id: '$reactionType', count: { $sum: 1 } } }
    ]);

    reactionCounts.forEach(rc => {
      story.reactions[rc._id] = rc.count;
    });

    await story.save();
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
