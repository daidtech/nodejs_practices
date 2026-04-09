const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { registerSchema, loginSchema } = require('../validations/user');

// Login route — validates, authenticates, sets cookie, redirects
router.post('/login', async (req, res, next) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.render('users/login', { errors: result.error.flatten().fieldErrors });
    }
    const { email, password } = result.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.render('users/login', { error: 'Invalid email or password.' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.render('users/login', { error: 'Invalid email or password.' });
    }
    const token = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
    res.redirect('/');
  } catch (err) {
    next(err);
  }
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

// Logout route — clears cookie, redirects
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});


module.exports = router;