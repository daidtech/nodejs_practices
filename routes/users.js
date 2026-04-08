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

module.exports = router;
