const express = require('express')
const router = express.Router()
const formidable = require('formidable')
const path = require('path')
const fs = require('fs').promises
const validation = require('../utils/validation')
const serviceDb = require('../models/serviceDb')
const isAuth = require('../utils/auth')

router.get('/', isAuth, async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null
    const pictures = await serviceDb.findAllPictureOfUser(userId)
    res.render('pages/pictures', {
      pictures,
      title: 'Your pictures',
      auth: req.user ? true : false,
    })
  } catch (err) {
    next(err)
  }
})

router.get('/edit/:id', isAuth, async (req, res, next) => {
  try {
    const id = req.params.id
    const picture = await serviceDb.findPictureById(id)
    res.render('pages/edit', {
      id,
      title: 'Edit picture',
      auth: req.user ? true : false,
      pictureUrl: path.join('../../', picture.path),
    })
  } catch (err) {
    next(err)
  }
})

router.post('/edit/:id', isAuth, async (req, res, next) => {
  try {
    await serviceDb.updateDescriptionOfPicture(
      req.params.id,
      req.body.description,
    )
    res.redirect('/pictures')
  } catch (err) {
    next(err)
  }
})

router.post('/del/:id', isAuth, async (req, res, next) => {
  try {
    const picture = await serviceDb.findPictureById(req.params.id)
    const user = await serviceDb.findUserById(req.user._id)
    await serviceDb.deletePicture(picture._id)
    await serviceDb.updateSizeStorageForUser(
      user._id,
      user.storageSize - picture.size,
    )
    await fs.unlink(path.join(process.cwd(), 'public', picture.path))
    res.redirect('/pictures')
  } catch (err) {
    next(err)
  }
})

router.get('/upload', isAuth, (req, res, _) => {
  res.render('pages/upload', {
    auth: req.user ? true : false,
    message: req.flash('message').toString(),
  })
})

router.post('/upload', isAuth, async (req, res, next) => {
  const form = new formidable.IncomingForm()
  const publicDir = path.join(process.cwd(), 'public')
  const staticDir = path.join('images', `${req.user._id}`)
  const uploadDir = path.join(publicDir, staticDir)

  if (!(await isAccessible(uploadDir))) {
    await fs.mkdir(uploadDir)
  }

  form.uploadDir = uploadDir
  form.maxFileSize = 2 * 1024 * 1024 //2mb

  const { fields, files } = await parseFrom(form, req)
  const { path: temporaryName, size, name } = files.photo
  const { description } = fields
  const user = await serviceDb.findUserById(req.user._id)
  const newStorageSize = user.storageSize + size

  if (newStorageSize > user.storageLimit) {
    await fs.unlink(temporaryName)
    req.flash(
      'message',
      'Storage limit reached. Remove extra pictures to upload',
    )
    return res.redirect('/pictures/upload')
  }

  const isNotValid = validation.uploadFile({
    description,
    size,
    name,
  })

  if (isNotValid) {
    await fs.unlink(temporaryName)
    req.flash('message', isNotValid.message)
    return res.redirect('/pictures/upload')
  }

  const fileName = path.join(uploadDir, name)

  try {
    await fs.rename(temporaryName, fileName)
  } catch (err) {
    await fs.unlink(temporaryName)
    return next(err)
  }

  const pathImg = path.join(staticDir, name)

  try {
    await serviceDb.savePicture({
      description,
      size,
      path: pathImg,
      user: user._id,
    })
    await serviceDb.updateSizeStorageForUser(user._id, newStorageSize)
  } catch (err) {
    return next(err)
  }

  return res.redirect('/pictures')
})

const parseFrom = (form, req) => {
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      resolve({ fields, files })
    })
  })
}

const isAccessible = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false)
}

module.exports = router
