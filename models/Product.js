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

productSchema.methods.getDisplayName = function () {
  return this.name + ' - $' + this.price.toFixed(2);
}
productSchema.statics.findByCategory = function (category) {
  return this.find({ category });
};

productSchema.query.inStock = function () {
  return this.where({ inStock: true });
}
productSchema.index({ price: 1 }); // 1 is for ascending order, -1 for descending

module.exports = mongoose.model('Product', productSchema);
