// scripts/seed.js
// Seed test data for User, Post, Comment models
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nodejs_practices';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await Promise.all([
    User.deleteMany({}),
    Post.deleteMany({}),
    Comment.deleteMany({})
  ]);

  // Users
  const users = await User.insertMany([
    { name: 'Admin User', email: 'admin@example.com', passwordHash: 'hashedpassword1', role: 'admin' },
    { name: 'Editor One', email: 'editor1@example.com', passwordHash: 'hashedpassword2', role: 'user' },
    { name: 'Reader Two', email: 'reader2@example.com', passwordHash: 'hashedpassword3', role: 'user' },
    { name: 'Reader Three', email: 'reader3@example.com', passwordHash: 'hashedpassword4', role: 'editor' }
  ]);

  // Posts
  const posts = await Post.insertMany([
    { title: 'First Post', slug: 'first-post', content: 'Hello world!', status: 'published', tags: ['intro'], author: users[0]._id, publishedAt: new Date() },
    { title: 'Draft Post', slug: 'draft-post', content: 'This is a draft.', status: 'draft', tags: ['draft'], author: users[1]._id },
    { title: 'Archived Post', slug: 'archived-post', content: 'Old post.', status: 'archived', tags: ['archive'], author: users[2]._id }
  ]);

  // Comments
  await Comment.insertMany([
    { body: 'Great post!', post: posts[0]._id, author: users[1]._id },
    { body: 'Thanks for sharing.', post: posts[0]._id, author: users[2]._id },
    { body: 'Needs more detail.', post: posts[1]._id, author: users[0]._id, isSpam: true }
  ]);

  console.log('Seed data created.');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
