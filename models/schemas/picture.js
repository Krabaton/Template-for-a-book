const mongoose = require('mongoose')

const Schema = mongoose.Schema

const pictureSchema = new Schema({
  path: {
    type: String,
    required: [true, 'Path for image is required'],
    unique: true,
  },
  description: {
    type: String,
  },
  user: {
    type: String,
  },
  size: {
    type: Number,
  }
})

const Picture = mongoose.model('picture', pictureSchema)

module.exports = Picture
