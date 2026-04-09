import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express, { Request, Response, NextFunction } from 'express';
import passport from '../src/auth/passport';
import { registerSchema, loginSchema } from '../validations/user';

const prisma = new PrismaClient();
const router = express.Router();

// Login: Zod validation first, then Passport Local
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.render('users/login', { errors: result.error.flatten().fieldErrors });
    return;
  }

  passport.authenticate('local', { session: false }, (err: Error | null, user: Express.User | false, info: { message: string } | undefined) => {
    if (err) return next(err);
    if (!user) {
      res.render('users/login', { error: info?.message || 'Invalid email or password.' });
      return;
    }

    const typedUser = user as { id: number; role: string };
    const token = jwt.sign(
      { sub: typedUser.id, role: typedUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

    // Increment loginCount (fire-and-forget)
    prisma.user.update({
      where: { id: typedUser.id },
      data: { loginCount: { increment: 1 } }
    }).catch(() => {});

    res.redirect('/');
  })(req, res, next);
});

// Register route
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      res.render('users/register', { errors: result.error.flatten().fieldErrors });
      return;
    }
    const { name, email, password } = result.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.render('users/register', { error: 'Email already registered.' });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { name, email, passwordHash, active: true }
    });
    res.redirect('/users/login');
  } catch (err) {
    next(err);
  }
});

// Logout: clear cookie and redirect
router.get('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.redirect('/');
});

export default router;
