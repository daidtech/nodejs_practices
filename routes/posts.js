const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// List all posts
router.get('/', async (req, res) => {
  const posts = await Post.find().populate('author');
  res.render('pages/posts', { posts });
});

// Show post details and comments
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author');
  if (!post) return res.status(404).send('Post not found');
  const comments = await Comment.find({ post: post._id }).populate('author');
  res.render('pages/post_detail', { post, comments });
});

module.exports = router;
