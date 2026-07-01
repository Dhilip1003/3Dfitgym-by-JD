const mongoose = require('mongoose');

const foodSuggestionSchema = new mongoose.Schema(
  {
    userId: String,
    mealType: String,
    name: { type: String, required: true, trim: true },
    description: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
    fitnessGoal: { type: String, default: 'general' }
  },
  {
    collection: 'food_suggestions',
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('FoodSuggestion', foodSuggestionSchema);
