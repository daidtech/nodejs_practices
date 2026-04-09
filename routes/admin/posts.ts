import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// GET /admin/posts - render all posts for admin
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
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

export default router;
