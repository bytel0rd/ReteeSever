const express = require('express');
const passport = require('passport');

// a sub-authetication router is created
const router = new express.Router();

// importinng the converted UserModel from the schema
const Users = require('./../../models/userSchema.js').Users;

// import the passportInit and passing @ {passport} and @ {Users} model has a parameter
require('./passportInit.js')(passport, Users);

function currentUserBio(req, res) {
  return Users.findOne({
    _id: req.session.passport.user,
  }, (userErr, user) => {
    if (userErr) {
      return res.status(407).json({
        userErr,
      });
    }
    // sends a response with the user object
    return res.status(200).json({
      user,
    });
  });
}

// @ 'signIn' Route a post requests is sent
// the request body contains the email and password has a body
// which is used for login  authetication
// and a json response which contains the userId  is sent with the user data;
router
  .route('/SignIn')
  .post(passport.authenticate('login', {}), (req, res) => {
    // res.status(200).json({
    //   userId: req.session.passport,
    // });

    currentUserBio(req, res);
  });


// @ 'signUp' Route a post requests is sent
// the request body contains the email , password  and profile object has a body
// which is used for login  authetication
// and a json response which cotains the userid  is sent with the user data;
router
  .route('/SignUp')
  .post(passport.authenticate('signUp', {}), (req, res) => {
    // res.status(200).json({
    //   userId: req.session.passport,
    // });
    //
    currentUserBio(req, res);
  });


// if the user is succesfull in login in a
// user object is sent back to the user has response during a get request
// has a post request the corresponding sent data is updated by the user
// the dashboard route sends back and update the registered user's
// correspoinding biodatas if the user is unauthorized , the response
// is sent has a 401 response which is unaythorized request
router
  .route('/dashBoard')
  .get((req, res) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({
        mgs: 'unauthorize request login',
      });
    }
    Users.findOne({
      _id: req.session.passport.user,
    }).then((user) => {
      return res.status(200).json({
        user,
      });
    }, (err) => {
      return res.status(407).json({
        err,
      });
    });
  })
  .post((req, res) => {
    const newBio = req.body;
    Users.findOneAndUpdate({
      owner_ID: req.session.passport.user,
    }, {
      $set: {
        profile: newBio,
      },
    }, {
      new: true,
      upsert: true,
    }, (err, User) => {
      if (err) {
        res.status(401).json(err);
      }
      // the newly user object is sent back has a response
      res.status(201).json(User);
    });
  })
  .put((req, res) => {
    res.json({
      message: 'not update from server',
    });
  });
// this routes enable a login user to log out of the system
router
  .route('/logOut')
  .get((req, res) => {
    if (req.isAuthenticated()) {
      req.logOut();
    }
    res.redirect('/');
  });
// 'profile.address': newBio,
router.post('/authorizeAgent', (req, res) => {
  const newBio = req.body;
  Users.findOneAndUpdate({
    _id: req.session.passport.user,
  }, {
    $set: {
      'profile.isAgent': true,
      'profile.address': newBio.address,
    },
  }, {
    new: true,
    upsert: true,
  }, (err, User) => {
    if (err) {
      return res.status(304).json(err);
    }
    // the newly user object is sent back has a response
    return res.status(201).json(User);
  });
});

module.exports = router;
