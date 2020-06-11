const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const serviceDb = require('../models/serviceDb')

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  serviceDb
    .findUserById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err, null))
})

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      serviceDb
        .findUserByEmail(email)
        .then((user) => {
          if (!user) {
            return done(null, false, req.flash('message', 'User not found'))
          }
          if (!user.validPassword(password)) {
            return done(null, false, req.flash('message', 'Incorrect password'))
          }
          return done(null, user)
        })
        .catch((err) => done(err))
    },
  ),
)
