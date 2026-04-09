import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// GET /admin/users - render all users for admin
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.render('admin/users/users', { title: 'All Users', users });
  } catch (err) {
    next(err);
  }
});

// GET /admin/users/:user_id - render user detail for admin
router.get('/:user_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.user_id);
    if (isNaN(userId)) return res.status(400).send('Invalid user id');
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).send('User not found');
    res.render('admin/users/user', { title: user.name, user });
  } catch (err) {
    next(err);
  }
});

export default router;
