const passport = require('../src/auth/passport');

// Silently attach req.user from JWT cookie on every request.
// If no token or invalid token, req.user stays undefined — no error, no redirect.
function attachUserFromJWT(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err);
    if (user) req.user = user;
    next();
  })(req, res, next);
}

module.exports = attachUserFromJWT;
