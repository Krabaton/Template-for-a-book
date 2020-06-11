var express = require('express')
var router = express.Router()

const mainRouter = require('./main')
const usersRouter = require('./users')
const picturesRouter = require('./pictures')

router.use('/', mainRouter)
router.use('/users', usersRouter)
router.use('/pictures', picturesRouter)

module.exports = router