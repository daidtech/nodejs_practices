var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/home', { title: 'Home' });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('pages/about', { title: 'About' });
});

/* GET products UI page. */
router.get('/products', function(req, res, next) {
  res.render('pages/products', { title: 'Products' });
});

module.exports = router;
