const express = require('express')
const router = express.Router()
const serviceDb = require('../models/serviceDb')
const passport = require('passport')
const { v4: uuidV4 } = require('uuid')
const csrf = require('csurf')
const rateLimit = require('express-rate-limit')

const csrfProtection = csrf({ cookie: true })
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 2,
  handler: function(_, res) {
    res.render('info', {
      message: 'Too many accounts created from this IP, please try again after an hour',
      auth: false,
    })
  },
})

router.get('/registration', (req, res, _) => {
  res.render('pages/reg', {
    message: req.flash('message').toString(),
    auth: req.user ? true : false,
    title: 'Registration',
  })
})

router.get('/login', csrfProtection, (req, res, _) => {
  res.render('pages/login', {
    message: req.flash('message').toString(),
    auth: req.user ? true : false,
    csrfToken: req.csrfToken(),
    title: 'Sign in',
  })
})

router.post('/registration', limiter, async (req, res, next) => {
  try {
    const user = await serviceDb.findUserByEmail(req.body.email)
    if (user) {
      req.flash('message', 'User exist with this email')
      return res.redirect('/users/registration')
    } else {
      await serviceDb.createNewUser(req.body)
      req.flash('message', 'User create')
      return res.redirect('/users/login')
    }
  } catch (err) {
    next(err)
  }
})

router.post('/login', csrfProtection, (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.redirect('/')
    }
    req.logIn(user, async err => {
      if (err) {
        return next(err)
      }
      if (req.body.remember) {
        const token = uuidV4()
        await serviceDb.setTokenForUser(user, token)
        res.cookie('token', token, {
          maxAge: 7 * 60 * 60 * 1000,
          path: '/',
          httpOnly: true,
        })
      }
      res.redirect('/pictures')
    })
  })(req, res, next)
})

router.get('/logout', (req, res, _) => {
  req.logout()
  res.clearCookie('token')
  req.flash('message', 'user logout')
  res.redirect('/')
})

module.exports = router
