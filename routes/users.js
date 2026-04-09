var express = require('express');
var router = express.Router();
var logger = require('../middleware/logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.use(logger);

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    let users = await prisma.user.findMany();
    res.render('users', { title: 'Users', users: users });
  } catch (err) {
    next(err);
  }
});

/* GET user from list. */
router.get('/:user_id', async function(req, res, next) {
  try {
    // Prisma expects integer id by default; parse if needed
    const userId = parseInt(req.params.user_id, 10);
    if (isNaN(userId)) return next();
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return next();
    res.render('user', { title: user.name, user: user });
  } catch (err) {
    next(err);
  }
});


// Render login page
router.get('/login', (req, res) => {
  res.render('users/login');
});

// Render register page
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Render logout page (optional: can redirect or show a message)
router.get('/logout', (req, res) => {
  res.render('users/logout');
});

// Render password change page
router.get('/password-change', (req, res) => {
  res.render('users/password-change');
});


module.exports = router;
