const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs'); // for authetication in production

// module used for random number generation
const crypto = require('crypto');
// const biguint = require('biguint-format');
const createHash = function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const isValidPassword = function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
};


// which is the number of constiables to be generated.
// this random method takes a parameter @{qty},
function random(qty) {
  return crypto.randomBytes(qty);
}


// the function is exported and @{passport, usersmodel} is passed
// has a parameter when imported
// into the autitication route;
module.exports = function authExport(passport, Users) {
  // serializeuser by holding ID for identifing specific user
  // sends  back a key  to decrypt the user
  // function serializingCallback(user, done) {
  // }
  passport.serializeUser((user, done) => {
    // console.log('serializing' + user._id);
    done(null, user._id);
  });

  // deserializeuser by using the serialize Key
  //  for decrytpting the user data
  passport.deserializeUser((_id, done) => {
    // console.log('deserializing' + _id);
    done(null, Users.findById(_id, (err, user) => {
      if (err) {
        // console.log('there is an error');
        return err;
      }
      return user;
    }));
  });


  // a 'SignIn' strategy has been created to autheticated Users
  // the function makes use of  two parameters @{email} @{password}
  // and sends a err response if it failed or user if succesfull.
  passport.use('login', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email',
    passwordField: 'password',
  },
    (req, email, password, done) => {
      // TODO: user NOT FOUND TODO: INVALID password TODO: AUTHENTICATE user
      Users.findOne({
        email,
      }, (err, user) => {
        if (err) {
          // console.log(err);
          return done(null, false, {
            message: 'user not found',
          });
        }
        if (user === null) {
          return done(null, false, {
            message: 'emailAddress not found',
          });
        }
        if (isValidPassword(user, password)) {
          return done(null, user);
        }
        return done(null, false, {
          message: 'INVALID password',
        });
      });
    }));


  // a 'signUp' strategy has been created to autheticated Users
  // the function makes use of  mutiple parameters @{emaiil} @{password} @{userProfile Object}
  // and sends a err response if it failed or user if succesfull.
  // passReqToCallback: allows us to pass back the entire request to the callback

  passport.use('signUp', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email',
    passwordField: 'password',
  },
    (req, email, password, done) => {
      // find a user in mongo with provided emailAddress
      Users.findOne({
        email,
      }, (err, user) => {
        // In case of any error, return using the done method
        if (err) {
          return done(err);
        }
        // already exists
        if (user) {
          return done(null, false, {
            message: 'userEmail already exist',
          });
        }
        // if there is no user, create the user
        // to  understand the user validation process
        // <a href='./userSchema.html'>userSchema</a>
        const newuser = new Users({
          password: createHash(password),
          email,
          profile: {
            fullName: req.body.fullName,
            userName: req.body.userName,
            phoneNo: req.body.phoneNo,
            customerId: random(7),
          },
        });

        // save the user
        // console.log(newuser);
        newuser.save((saveErr) => {
          if (saveErr) {
            // console.log('Error in Saving user: ' + err);
            // throw err;
            return done(null, false, {
              message: 'userSignUpvalidation fail',
              err: saveErr,
            });
          }
          return done(null, newuser);
          /* console.log(newuser.username + ' Registration succesful');*/
        });
      });
    }));
};
