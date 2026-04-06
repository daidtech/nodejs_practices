var express = require('express');
var router = express.Router();

var users = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' },
  { id: 3, name: 'Bob', email: 'bob@example.com' }
];
logger = require('../middleware/logger');
router.use(logger);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users', { title: 'Users', users: users });
});

/* GET user from list. */
router.get('/:user_id', function(req, res, next) {
  var user = users.find(function(u) { return u.id === parseInt(req.params.user_id); });
  if (!user) {
    return next();
  }
  res.render('user', { title: user.name, user: user });
});
/* GET user from list. */
router.get('/test', function(req, res, next) {
  res.render('user', { title: 'Test User', user: { id: 0, name: 'Test User', email: 'test@example.com' } });
});

module.exports = router;
