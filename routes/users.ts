import express, { Request, Response, NextFunction } from 'express';
import logger from '../middleware/logger';
import { PrismaClient } from '@prisma/client';
import { userIdParamSchema } from '../validations/user';

const prisma = new PrismaClient();
const router = express.Router();

router.use(logger);

/* GET users listing. */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany();
    res.render('users', { title: 'Users', users });
  } catch (err) {
    next(err);
  }
});

/* GET user from list. */
router.get('/:user_id(\\d+)', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = userIdParamSchema.safeParse(req.params);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }
    const user = await prisma.user.findUnique({ where: { id: result.data.user_id } });
    if (!user) return next();
    res.render('user', { title: user.name, user });
  } catch (err) {
    next(err);
  }
});

// Render login page
router.get('/login', (_req: Request, res: Response) => {
  res.render('users/login');
});

// Render register page
router.get('/register', (_req: Request, res: Response) => {
  res.render('users/register');
});

// Render logout page
router.get('/logout', (_req: Request, res: Response) => {
  res.render('users/logout');
});

// Profile page (requires login)
router.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.redirect('/users/login');
    return;
  }
  try {
    const typedUser = req.user as { id: number };
    const profile = await prisma.profile.findUnique({ where: { userId: typedUser.id } });
    res.render('users/profile', { title: 'My Profile', user: req.user, profile });
  } catch (err) {
    next(err);
  }
});

// Render password change page
router.get('/password-change', (_req: Request, res: Response) => {
  res.render('users/password-change');
});

export default router;
