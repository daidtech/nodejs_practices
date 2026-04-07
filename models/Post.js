const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true },
  content:     { type: String, required: true },
  status:      { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  viewCount:   { type: Number, default: 0 },
  tags:        [String],
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  publishedAt: { type: Date, default: null },
}, { timestamps: true })

module.exports = mongoose.model('Post', postSchema)
