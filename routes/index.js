var express = require('express');
var router = express.Router();

/* GET home page. */
// sends the home page to the client browser
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// creating a sub router string to all base routes imported from
//<a href="./auth.html">auth.js</a>
// geting a url with "/auth/<subRoute>" string
router.use('/auth',require('./auth/auth.js'));

module.exports = router;

// <a href="./users.html">link a</a>
