var mongoose = require('mongoose');

var productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be at least 0']
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'general'
    },
    inStock: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
