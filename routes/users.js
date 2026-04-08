var express = require('express');
var router = express.Router();
var logger = require('../middleware/logger');
const User = require('../models/User');

var paidContent = [
  { id: 1, title: 'Premium article', body: 'This is paid-only content.' },
  { id: 2, title: 'VIP guide', body: 'Thanks for supporting the platform.' }
];

router.use(logger);

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let users = await User.find();
  res.render('users', { title: 'Users', users: users });
});

/* Demo route behind a paywall. */
router.get('/a_route_behind_paywall',
  function(req, res, next) {
    var hasPaid = req.query.paid === 'true' || req.get('x-has-paid') === 'true';

    req.user = { hasPaid: hasPaid };

    console.log('Checking if user has paid');
    console.log(req.user);

    if (!req.user.hasPaid) {
      return next('route');
    }

    next();
  },
  function(req, res) {
    res.json({
      access: 'granted',
      content: paidContent
    });
  }
);

router.get('/a_route_behind_paywall', function(req, res) {
  res.status(402).json({
    access: 'denied',
    message: 'Payment required. Use ?paid=true or send header x-has-paid: true to test access.'
  });
});

/* GET user from list. */
router.get('/:user_id', async function(req, res, next) {
  var user = await User.findById(req.params.user_id);
  if (!user) {
    return next();
  }
  res.render('user', { title: user.name, user: user });
});

module.exports = router;
