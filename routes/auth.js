const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const passport = require('../src/auth/passport');
const router = express.Router();
const { registerSchema, loginSchema } = require('../validations/user');

// Login: Zod validation first, then Passport Local
router.post('/login', (req, res, next) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.render('users/login', { errors: result.error.flatten().fieldErrors });
  }

  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.render('users/login', { error: info?.message || 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

    // Increment loginCount (fire-and-forget)
    prisma.user.update({
      where: { id: user.id },
      data: { loginCount: { increment: 1 } }
    }).catch(() => {});

    res.redirect('/');
  })(req, res, next);
});

// Register route
router.post('/register', async (req, res, next) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.render('users/register', { errors: result.error.flatten().fieldErrors });
    }
    const { name, email, password } = result.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.render('users/register', { error: 'Email already registered.' });
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
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
