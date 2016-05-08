var LocalStrategy = require('passport-local').Strategy;
// var bcrypt = require('bcrypt-nodejs'); for authetication in production

// module used for random number generation
var crypto = require('crypto');
var biguint = require('biguint-format');

//the function is exported and @{passport} is passed
// has a parameter when imported
// into the autitication route;
module.exports = function(passport,Users) {

  //serializeuser by holding ID for identifing specific user
  // sends  back a key  to decrypt the user
  passport.serializeUser(function(user, done) {
    // console.log('serializing' + user._id);
    done(null, user._id);
  });

  //deserializeuser by using the serialize Key
  //  for decrytpting the user data
  passport.deserializeUser(function(_id, done) {
    // console.log('deserializing' + _id);
    done(null, Users.findById(_id, function(err, user) {
      if (err) {
        //console.log('there is an error');
        return err;
      }
      return user;

    }));
  });


    // a "SignIn" strategy has been created to autheticated Users
    // the function makes use of  two parameters @{email} @{password}
    // and sends a err response if it failed or user if succesfull.
  passport.use('login', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email',
    passwordField: 'password'
  }, function(req, email, password, done) {
    // TODO: user NOT FOUND TODO: INVALID password TODO: AUTHENTICATE user
    Users.findOne({
      'email': email
    }, function(err, user) {
      if (err) {
        console.log(err);
        return done(null, false, {
          message: 'user not found'
        });
      }
      if (user === null) {
        return done(null, false, {
          message: "emailAddress not found"
        });
      } else {
        // console.log(user);
        if (isValidPassword(user, password)) {
          return done(null, false, {
            message: 'INVALID password'
          });
        } else {
          return done(null, user);
        }
      }

    });

  }));


  // a "signUp" strategy has been created to autheticated Users
  // the function makes use of  mutiple parameters @{emaiil} @{password} @{userProfile Object}
  // and sends a err response if it failed or user if succesfull.

  passport.use('signUp', new LocalStrategy({
      passReqToCallback: true,
      usernameField: 'email',
      passwordField: 'password' // allows us to pass back the entire request to the callback
    },

    function(req, email, password, done) {
      console.log("executing");

      // find a user in mongo with provided emailAddress
      Users.findOne({
        'email': email
      }, function(err, user) {
        console.log(user);
        // In case of any error, return using the done method
        if (err) {
          console.log('Error in SignUp: '+err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('user already exists with email: '+ email);
          return done(null, false, {
            message: 'userEmail already exist'
          });
        } else {
          // if there is no user, create the user
          // to  understand the user validation process
          // <a href="./userSchema.html">userSchema</a>
          var newuser = new Users({
            'password': createHash(password),
            'email': email,
            'profile': {
              'fullName': req.body.fullName,
              'userName': req.body.userName,
              'phoneNo': req.body.phoneNo,
              'customerId': random(7)
            }
          });



            // save the user
            // console.log(newuser);
            newuser.save(function(err) {
              if (err) {
                console.log('Error in Saving user: ' + err);
                // throw err;
                return done(null, false, {
                  'message': 'userSignUpvalidation fail',
                  'err': err
                });
              }
              /* console.log(newuser.username + ' Registration succesful');*/
              return done(null, newuser);
            });
        }
      });
    }));



  var isValidPassword = function(user, password) {
    return user.password !== password;
    /* bcrypt.compareSync(password, user.password);*/
  };

  var createHash = function(password) {
    return password;
    /* bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);*/
  };


};


//which is the number of variables to be generated.
// this random method takes a parameter @{qty},
function random(qty) {
  return crypto.randomBytes(qty);
}
