const express = require('express')
const router = express.Router()
const serviceDb = require('../models/serviceDb')

router.get('*', async (req, _, next) => {
  const isToken = !!req.cookies.token
  if (isToken && !req.isAuthenticated()) {
    const user = await serviceDb.findUserByToken(req.cookies.token)
    if (user) {
      req.logIn(user, (err) => {
        if (err) {
          return next(err)
        }
        next()
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

router.get('/', (req, res, _) => {
  res.render('pages/index', {
    title: 'Pictures service',
    auth: req.user ? true : false,
    message: req.flash('message').toString(),
  })
})

module.exports = router
