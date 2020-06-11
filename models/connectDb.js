const mongoose = require('mongoose')

require('dotenv').config();
let uri = process.env.uriDB;

mongoose.Promise = global.Promise
mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
)

mongoose.connection.on('connected', () => {
  console.log('Connection!')
})

mongoose.connection.on('error', (err) => {
  console.log(err)
})

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Close MongoDb')
    process.exit(0)
  })
})
