const User = require('./schemas/user')
const Picture = require('./schemas/picture')

const createNewUser = ({ email, password, nick }) => {
  const newUser = new User()
  newUser.email = email
  newUser.setPassword(password)
  newUser.nick = nick
  return newUser.save()
}

const findUserByToken = (token) => {
  return User.findOne({ token })
}

const findUserByEmail = (email) => {
  return User.findOne({ email })
}

const findUserById = (id) => {
  return User.findById({ _id: id })
}

const setTokenForUser = (user, token) => {
  user.setToken(token)
  return user.save()
}

const updateSizeStorageForUser = (id, size) => {
  return User.findByIdAndUpdate({ _id: id }, { $set: { storageSize: size } })
}

const savePicture = (options) => {
  const { path, description, user, size } = options
  const newRecord = new Picture({
    path,
    description,
    user,
    size,
  })

  return newRecord.save()
}

const findAllPictureOfUser = (id) => {
  return Picture.find({ user: id })
}

const findPictureById = (id) => {
  return Picture.findOne({ _id: id })
}

const updateDescriptionOfPicture = (id, description) => {
  return Picture.findByIdAndUpdate({ _id: id }, { $set: { description } })
}

const deletePicture = (id) => {
  return Picture.findByIdAndDelete({ _id: id })
}

module.exports = {
  savePicture,
  createNewUser,
  updateSizeStorageForUser,
  setTokenForUser,
  findUserByToken,
  findUserByEmail,
  findUserById,
  findAllPictureOfUser,
  findPictureById,
  updateDescriptionOfPicture,
  deletePicture,
}
