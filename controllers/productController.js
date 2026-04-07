var mongoose = require('mongoose');
var Product = require('../models/Product');

function ensureDatabaseConnection(res) {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      message: 'Database not connected. Set MONGODB_URI and restart the server.'
    });
    return false;
  }

  return true;
}

exports.getAllProducts = async function(req, res, next) {
  if (!ensureDatabaseConnection(res)) {
    return;
  }

  try {
    var products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async function(req, res, next) {
  if (!ensureDatabaseConnection(res)) {
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product id' });
  }

  try {
    var product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async function(req, res, next) {
  if (!ensureDatabaseConnection(res)) {
    return;
  }

  try {
    var product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async function(req, res, next) {
  if (!ensureDatabaseConnection(res)) {
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product id' });
  }

  try {
    var product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async function(req, res, next) {
  if (!ensureDatabaseConnection(res)) {
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product id' });
  }

  try {
    var product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
