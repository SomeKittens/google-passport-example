var passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var getDb = require('./db');

var host = require('./config').host;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://www.google-passport-example.herokuapp.com/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    getDb(function() {
      return this.client.queryAsync('SELECT * FROM profiles WHERE profileId=$1', [profile.id])
      .get('rows').get(0)
      .then(function(result) {
        if (result) {
          // They've already logged in and we're done
          return done(null, result);
        } else {
          // First time login, we need to create a profile
          return this.client.queryAsync('INSERT INTO profiles (profileId, username, email) VALUES ($1, $2, $3) RETURNING id',
            [profile.id, profile.displayName, profile.emails[0].value]);
        }
      })
      .then(function(id) {
        if (!id) { return; }
        var sessionData = {
          name: profile.displayName,
          email: profile.emails[0].value,
          profileId: profile.id,
          id: id
        };
        done(null, sessionData);
      }).catch(console.log.bind(console));
    });
  }
));

// Stuff you already know how to do
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});