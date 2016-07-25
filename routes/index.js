const express = require('express');
const router = express.Router();

/* GET home page. */
// sends the home page to the client browser
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Express'
  });
});

// creating a sub router string to all base routes imported from
// <a href="./auth.html">auth.js</a>
// geting a url with "/auth/<subRoute>" string
router.use('/auth', require('./auth/auth.js'));
router.use('/api', (req, res, next) => {
  if (!req.session.passport.user) {
    res.status(401).json({
      mgs: 'unauthorized user',
    });
  }
  next();
});
router.use('/api', require('./api/orders.js'));

module.exports = router;

// <a href="./users.html">link a</a>
