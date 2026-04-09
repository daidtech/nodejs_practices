const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /admin/posts - render all posts for admin
router.get('/', async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { name: true } },
        category: { select: { description: true } },
        tags: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.render('admin/posts/posts', { title: 'All Posts', posts });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
