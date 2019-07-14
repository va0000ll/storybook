let User = require('../models/User');
let keys = require('./keys');
let googleStrategy = require('passport-google-oauth20').Strategy;

// User.deleteOne({ image: '' }, err => {
//   console.log('SUC', err);
// });

module.exports = function(passport) {
  passport.use(
    new googleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
        proxy: true
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOne(
          {
            googleID: profile.id
          },
          (err, user) => {
            if (err) {
              throw err;
            }

            if (user) {
              done(null, user);
            } else {
              let newUser = {
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                image: profile.photos[0].value
              };

              new User(newUser)
                .save()
                .then(user => done(null, user))
                .catch(err => {
                  throw err;
                });
            }
          }
        );
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(null, user));
  });
};
