const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const mongoose = require('mongoose')
const passport = require('passport')
const helmet = require('helmet')
const configSession = require('./config/session')
const app = express()
require('./models/connectDb')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(
  session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    ...configSession,
  }),
)
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())
require('./config/config-passport')
app.use(passport.initialize())
app.use(passport.session())
app.use(helmet())
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))

app.use('/', require('./routes'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error', { auth: req.user ? true : false })
})

module.exports = app
