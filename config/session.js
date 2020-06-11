module.exports = {
  secret: 'bad boy',
  key: 'cookie-app',
  resave: true,
  saveUninitialized: false,
  ephemeral: true,
  rolling: true,
  cookie: { maxAge: 30 * 60 * 1000 },
}