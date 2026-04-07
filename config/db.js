var mongoose = require('mongoose');

async function connectDB() {
  var mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('[db] MONGODB_URI is not set. CRUD API will return 503 until MongoDB is configured.');
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('[db] MongoDB connected successfully');
  } catch (error) {
    console.error('[db] MongoDB connection error:', error.message);
  }
}

module.exports = connectDB;
