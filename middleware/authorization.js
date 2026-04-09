const createError = require('http-errors');

// Redirect to login if not authenticated
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.redirect('/users/login');
  }
  next();
}

// Require a specific role (e.g. 'admin')
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect('/users/login');
    }
    if (req.user.role !== role) {
      return next(createError(403, 'Forbidden'));
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
