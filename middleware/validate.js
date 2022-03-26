const { validationResult, buildCheckFunction } = require('express-validator')
const { default: mongoose } = require('mongoose')
exports = module.exports = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)))

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    res.status(400).json({ errors: errors.array() })
  }
}

exports.isValidObjectId = (locations, fields) => {
  return buildCheckFunction(locations)(fields).custom(async value => {
    if (!mongoose.isValidObjectId(value)) {
      return Promise.reject('ID不是一个有效ObjectId')
    }
  })
}