const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const sessionStore = require('connect-mongo')(session);

const mongoose = require('mongoose');
const passport = require('passport');
// datbase connection address
const url = 'mongodb://127.0.0.1/iDeliver';
mongoose.connect(url, (err) => {
  if (err) {
    throw 'connect or check connection to mongodb';
  }
});

// initalizing express framework for routing routes
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(session({
  secret: 'Wealth Like The Sea',
  saveUninitialized: true,
  resave: true,
  store: new sessionStore({
    mongooseConnection: mongoose.connection,
    collection: 'sessions',
    ttl: 14 * 24 * 60 * 60,
    touchAfter: 12 * 3600,
  }),
}));

// initalizung passport for express
app.use(passport.initialize());
app.use(passport.session());

// continuing default midelware applications
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

const routes = require('./routes/index');

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});


module.exports = app;
