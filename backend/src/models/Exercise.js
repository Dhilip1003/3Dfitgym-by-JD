const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: String,
    targetBodyPart: { type: String, required: true, trim: true },
    videoUrl: String,
    articleUrl: String,
    difficulty: String,
    equipment: [String]
  },
  {
    collection: 'exercises',
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

module.exports = mongoose.model('Exercise', exerciseSchema);
