const mongoose = require('mongoose');

const safeUrlValidator = {
  validator(value) {
    if (!value) return true;
    return /^https?:\/\/[^\s]+$/i.test(value);
  },
  message: 'imageUrl must be a valid http(s) URL.'
};

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: String,
    price: { type: Number, min: 0 },
    category: String,
    imageUrl: { type: String, validate: safeUrlValidator },
    stock: { type: Number, min: 0 },
    status: String
  },
  {
    collection: 'products',
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

module.exports = mongoose.model('Product', productSchema);
