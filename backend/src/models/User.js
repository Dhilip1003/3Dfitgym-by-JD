const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const safeUrlValidator = {
  validator(value) {
    if (!value) return true;
    return /^(https?:\/\/|\/)[^\s]+$/i.test(value);
  },
  message: 'modelUrl must be an http(s) or local path URL.'
};

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
    modelUrl: { type: String, validate: safeUrlValidator },
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
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true, minlength: 8, select: false },
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
        delete ret.password;
        if (ret.bodyModel?.sourceFiles) delete ret.bodyModel.sourceFiles;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

module.exports = mongoose.model('User', userSchema);
