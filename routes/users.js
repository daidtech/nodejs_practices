var express = require('express');
var router = express.Router();

var users = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' },
  { id: 3, name: 'Bob', email: 'bob@example.com' }
];

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

module.exports = router;
