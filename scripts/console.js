const mongoose = require('mongoose');
global.Product = require('../models/Product');
var mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.warn('[console] MONGODB_URI is not set. Console will attempt to connect to mongodb://127.0.0.1:27017/myapp');
  mongoUri = 'mongodb://127.0.0.1:27017/nodejs_practices';
}
mongoose.connect(mongoUri).then(() => {
  console.log('[console] Connected to MongoDB');
  console.log('You can now use the Product model to interact with the products collection in MongoDB.');
  console.log('Example:');
  console.log('  const newProduct = await Product.create({ name: "Sample Product", price: 9.99 });');
  console.log('  const products = await Product.find();');

}).catch((error) => {
  console.error('[console] MongoDB connection error:', error.message);
});