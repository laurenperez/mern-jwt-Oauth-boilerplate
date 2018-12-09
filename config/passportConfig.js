var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GoogleUser = require('../models/googleUser')


passport.serializeUser(function(user,done) {
  done(null,user.id)
});

passport.deserializeUser(function(id, done) {
  GoogleUser.findById(id, function(err,user) {
    done(err,user);
  })
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(acessToken, refreshToken, profile, done) {
    GoogleUser.findOne({ 'googleId': profile.id }, function(err, user) {
      if (err) {
        return done(err)
      }
      if (user) {
        //if a user is found log them in
        return done(null, user)
      } else {
        //create a new google users
        var newUser = new GoogleUser();
        newUser.googleId = profile.id;
        newUser.displayName = profile.displayName;

        newUser.save(function(err){
          if (err) {
            throw err;
          }
          return done(null, newUser)
        })
      }
    })
  }
));


module.exports = passport;
