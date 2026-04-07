const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  body:   { type: String, required: true, maxlength: 1000 },
  isSpam: { type: Boolean, default: false },
  likes:  { type: Number, default: 0 },
  post:   { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

module.exports = mongoose.model('Comment', commentSchema)
