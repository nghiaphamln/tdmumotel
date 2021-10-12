const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/user.model");
const configAuth = require("../config/auth");

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // SIGNUP LOCAL
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        fullnameField: "name",
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },

      function (req, email, password, done) {
        process.nextTick(function () {
          User.findOne({ "local.email": email }, function (err, user) {
            if (err) return done(err);
            if (user) {
              return done(
                null,
                false,
                req.flash("signupMessage", "Email này đã được sử dụng!")
              );
            } else {
              var newUser = new User();
              newUser.local.name = req.body.fullname;
              newUser.name = req.body.fullname;
              newUser.local.email = email;
              newUser.email = email;
              newUser.local.password = newUser.generateHash(password);
              newUser.save(function (err) {
                if (err) throw err;
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );

  // LOGIN LOCAL
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        User.findOne({ "local.email": email }, function (err, user) {
          if (err) return done(err);
          if (!user)
            return done(
              null,
              false,
              req.flash(
                "loginMessage",
                "Thông tin tài khoản hoặc mật khẩu không chính xác!"
              )
            );
          if (!user.validPassword(password))
            return done(
              null,
              false,
              req.flash(
                "loginMessage",
                "Thông tin tài khoản hoặc mật khẩu không chính xác!"
              )
            );
          return done(null, user);
        });
      }
    )
  );

  // FACEBOOK LOGIN
  passport.use(
    new FacebookStrategy(
      {
        // pull in our app id and secret from our auth.js file
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
      },

      // facebook will send back the token and profile
      (token, refreshToken, profile, done) => {
        // asynchronous
        process.nextTick(() => {
          // find the user in the database based on their facebook id
          User.findOne(
            {
              "facebook.id": profile.id,
            },
            (err, user) => {
              // if there is an error, stop everything and return that
              // ie an error connecting to the database
              if (err) return done(err);

              // if the user is found, then log them in
              if (user) {
                return done(null, user); // user found, return that user
              } else {
                // if there is no user found with that facebook id, create them
                var newUser = new User();

                // set all of the facebook information in our user model
                newUser.facebook.id = profile.id; // set the users facebook id
                newUser.facebook.token = token; // we will save the token that facebook provides to the user
                newUser.name = profile.displayName; // look at the passport user profile to see how names are returned

                // save our user to the database
                newUser.save((err) => {
                  if (err) throw err;

                  // if successful, return the new user
                  return done(null, newUser);
                });
              }
            }
          );
        });
      }
    )
  );

  // GOOGLE LOGIN
  passport.use(
    new GoogleStrategy(
      {
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
      },
      function (token, refreshToken, profile, done) {
        process.nextTick(function () {
          // // tìm trong db xem có user nào đã sử dụng google id này chưa
          User.findOne({ "google.id": profile.id }, function (err, user) {
            if (err) return done(err);
            if (user) {
              // if a user is found, log them in
              return done(null, user);
            } else {
              // if the user isnt in our database, create a new user
              var newUser = new User();
              // set all of the relevant information
              newUser.google.id = profile.id;
              newUser.google.token = token;
              newUser.name = profile.displayName;
              newUser.email = profile.emails[0].value; // pull the first email
              // save the user
              newUser.save(function (err) {
                if (err) throw err;
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );
};
