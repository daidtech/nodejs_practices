const { Strategy: JwtStrategy } = require('passport-jwt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Read JWT from httpOnly cookie named "token"
function cookieExtractor(req) {
  return (req && req.cookies) ? req.cookies.token : null;
}

const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET,
  },
  async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

module.exports = jwtStrategy;
