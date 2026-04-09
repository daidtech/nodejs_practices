const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const localStrategy = new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return done(null, false, { message: 'Invalid email or password.' });
      if (!user.active) return done(null, false, { message: 'Account is inactive.' });

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return done(null, false, { message: 'Invalid email or password.' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

module.exports = localStrategy;
