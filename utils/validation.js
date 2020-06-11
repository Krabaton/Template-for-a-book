const Joi = require('@hapi/joi')

module.exports.uploadFile = (obj) => {
  const schema = Joi.object({
    description: Joi.string().min(3).max(300).required(),
    name: Joi.string().min(3).max(120).required().messages({
      'string.empty': `File isn't empty`,
    }),
    size: Joi.number().integer().min(1).required().messages({
      'number.min': `File isn't empty`,
    }),
  })

  const { error } = schema.validate(obj)
  if (error) {
    return error
  }

  return false
}
