var express = require('express');
var passport = require('passport');

// a sub-authetication router is created
var router = require('express').Router();

// importinng the converted UserModel from the schema
var Users = require('./../../models/userSchema.js').Users;

// import the passportInit and passing @ {passport} and @ {Users} model has a parameter
require('./passportInit.js')(passport,Users);

// @ "signIn" Route a post requests is sent
// the request body contains the email and password has a body
// which is used for login  authetication
// and a json response is sent with the user data;
router
  .route('/SignIn')
  .post(passport.authenticate('login', {
    successRedirect: '/auth/dashBoard'
  }));


  // @ "signUp" Route a post requests is sent
  // the request body contains the email , password  and profile object has a body
  // which is used for login  authetication
  // and a json response is sent with the user data;

router
  .route('/SignUp')
  .post(passport.authenticate('signUp', {
    successRedirect: '/auth/dashBoard'
    // ,failureRedirect: '/auth/retrylogin'
  }));


// if the user is succesfull in login in a
// user object is sent back to the user has response during a get request
// has a post request the corresponding sent data is updated by the user
router
  .route('/dashBoard')
  .get(function(req, res) {
    console.log(req.session.passport);
    console.log(req.session.passport.user);
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      Users.findOne({
        owner_ID: req.session.passport.user
      }, function(err, User) {
        if (err)
          return (err);
        if (User === null)
          res.redirect('/auth/editDashBoard');
        // console.log(User);
        // sends a response with the user object
        res.status(200).json({"login": true, User: User});
        return User;
      });
    }
  })
  .post(function(req, res) {
    var newBio = req.body;

    Users.findOneAndUpdate({
      owner_ID: req.session.passport.user
    }, {
      $set: newBio
    }, {
      new: true,
      upsert: true
    }, function(err, User) {
      if (err)
        res.send(err);
        // the newly user object is sent back has a response
      res.status(201).json(User);
    });


  })
  .put(function(req, res) {

  });

  // this routes enable a login user to log out of the system
router
  .route('/logOut')
  .get(function(req, res) {
    if (req.isAuthenticated()) {
      req.logOut();
    }
    res.redirect('/');
  });

module.exports = router;
