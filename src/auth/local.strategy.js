const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' }, // tell it to use email
  async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return done(null, false, { message: 'User not found' });
      if (!user.active) return done(null, false, { message: 'Account inactive' });

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return done(null, false, { message: 'Wrong password' });

      return done(null, user); // success — attaches user to req.user
    } catch (err) {
      return done(err);
    }
  }
));