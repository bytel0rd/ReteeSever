var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var sessionStore = require('connect-mongo')(session);

var mongoose = require('mongoose');
var passport = require('passport');

// datbase connection address
var url = "mongodb://127.0.0.1/iDeliver";
mongoose.connect(url, function error(err) {
  if (err)
    console.log('fuck set up the mongodb and mongo');
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(session({
  secret: 'Wealth Like The Sea',
  saveUninitialized: true,
  resave: true,
  // using store session on MongoDB using express-session + connect
  store: new sessionStore({
    mongooseConnection: mongoose.connection,
    collection: 'sessions',
    ttl: 14 * 24 * 60 * 60,
    touchAfter: 12 * 3600
  })
}));

// initalizung passport for express
app.use(passport.initialize());
app.use(passport.session());

//continuing default midelware applications
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index');

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
