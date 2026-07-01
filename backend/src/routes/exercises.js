const express = require('express');
const Exercise = require('../models/Exercise');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    res.json(await Exercise.find());
  } catch (error) {
    next(error);
  }
});

router.get('/body-part/:bodyPart', async (req, res, next) => {
  try {
    res.json(await Exercise.find({ targetBodyPart: req.params.bodyPart }));
  } catch (error) {
    next(error);
  }
});

router.get('/suggest/:userId', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.bodyModel?.metrics) {
      return res.json(await Exercise.find());
    }

    const targetParts = identifyTargetBodyParts(user.bodyModel.metrics);
    const exercises = await Exercise.find({ targetBodyPart: { $in: targetParts } });
    return res.json(exercises);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.status(201).json(await Exercise.create(req.body));
  } catch (error) {
    next(error);
  }
});

function identifyTargetBodyParts(metrics) {
  const parts = [];
  if (metrics.chest !== undefined && metrics.chest < 40) parts.push('chest');
  if (metrics.arms !== undefined && metrics.arms < 12) parts.push('arms');
  if (metrics.waist !== undefined && metrics.waist > 35) parts.push('waist');
  return parts.length ? parts : ['full-body'];
}

module.exports = router;
