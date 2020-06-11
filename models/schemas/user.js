const mongoose = require('mongoose')
const bCrypt = require('bcryptjs')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  hash: {
    type: String,
    required: [true, 'Password is required'],
  },
  nick: {
    type: String,
    set: (i) => (i === '' ? `User${Date.now()}` : i),
  },
  token: {
    type: String,
  },
  storageSize : {
    type: Number,
    default: 0,
  },
  storageLimit: {
    type: Number,
    default: 1e+7, // 10 Mb
  }
})

userSchema.methods.setPassword = function (password) {
  this.hash = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}

userSchema.methods.validPassword = function (password) {
  return bCrypt.compareSync(password, this.hash)
}

userSchema.methods.setToken = function (token) {
  this.token = token
}

const User = mongoose.model('user', userSchema)

module.exports = User
