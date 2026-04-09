// middleware/authentication.js
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware to attach user from JWT cookie to req.user
function attachUserFromJWT(req, res, next) {
  const token = req.cookies && req.cookies.token;
  if (!token) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    prisma.user.findUnique({ where: { id: payload.sub } })
      .then(user => {
        if (user) req.user = user;
        next();
      })
      .catch(() => next());
  } catch {
    next();
  }
}

module.exports = attachUserFromJWT;
