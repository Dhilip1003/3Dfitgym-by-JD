const mongoose = require('mongoose');

const bodyMetricsSchema = new mongoose.Schema(
  {
    chest: Number,
    waist: Number,
    hips: Number,
    arms: Number,
    thighs: Number,
    shoulders: Number
  },
  { _id: false }
);

const bodyModelSchema = new mongoose.Schema(
  {
    modelUrl: String,
    sourceFiles: [String],
    reconstructionProvider: String,
    reconstructionStatus: {
      type: String,
      enum: ['manual', 'pending', 'completed', 'failed'],
      default: 'manual'
    },
    metrics: bodyMetricsSchema,
    lastUpdated: Date
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    bodyModel: bodyModelSchema,
    fitnessGoals: [String]
  },
  {
    collection: 'users',
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
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

module.exports = mongoose.model('User', userSchema);
