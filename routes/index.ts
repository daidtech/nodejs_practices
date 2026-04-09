import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', (_req, res) => {
  res.render('pages/home', { title: 'Home' });
});

/* GET about page. */
router.get('/about', (_req, res) => {
  res.render('pages/about', { title: 'About' });
});

export default router;
