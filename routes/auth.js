const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Login route — uses Local strategy
router.post('/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    // req.user is set by the strategy
    const token = jwt.sign(
      { sub: req.user.id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.render('/', { token, user: { id: req.user.id, name: req.user.name } });
  }
);

// Protected route — uses JWT strategy
router.get('/me',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

// Register route
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, active: true }
    });
    res.render('users/login', { id: user.id, name: user.name, email: user.email });
  } catch (err) {
    next(err);
  }
});


module.exports = router;