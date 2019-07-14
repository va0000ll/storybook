let router = require('express').Router();
let { ensureAutheticated, ensureGues } = require('../helpers/auth');
let Story = require('../models/Story');

router.get('/', ensureGues, (req, res) => {
  res.render('index/welcome');
});

router.get('/dashboard', ensureAutheticated, (req, res) => {
  Story.find({ user: req.user.id }, (err, stories) => {
    res.render('index/dashboard', { stories });
  });
});

router.get('/about', (req, res) => {
  res.render('index/about');
});

module.exports = router;
