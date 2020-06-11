module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('message', 'Access denied!')
  res.redirect('/')
}

