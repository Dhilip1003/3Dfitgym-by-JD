const mongoose = require('mongoose');

const safeUrlValidator = {
  validator(value) {
    if (!value) return true;
    return /^https?:\/\/[^\s]+$/i.test(value);
  },
  message: 'URL fields must be valid http(s) URLs.'
};

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: String,
    targetBodyPart: { type: String, required: true, trim: true },
    videoUrl: { type: String, validate: safeUrlValidator },
    articleUrl: { type: String, validate: safeUrlValidator },
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
