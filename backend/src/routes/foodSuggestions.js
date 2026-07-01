const express = require('express');
const FoodSuggestion = require('../models/FoodSuggestion');
const User = require('../models/User');
const { pick, requireObjectId } = require('../utils/request');

const router = express.Router();

router.get('/user/:userId', requireObjectId, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const goal = user.fitnessGoals?.length ? user.fitnessGoals[0] : 'general';
    res.json(await FoodSuggestion.find({ fitnessGoal: goal }));
  } catch (error) {
    next(error);
  }
});

router.get('/', async (_req, res, next) => {
  try {
    res.json(await FoodSuggestion.find());
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.status(201).json(await FoodSuggestion.create(pick(req.body, [
      'userId',
      'mealType',
      'name',
      'description',
      'calories',
      'protein',
      'carbs',
      'fats',
      'fitnessGoal'
    ])));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
