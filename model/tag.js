const { default: mongoose } = require('mongoose')
const baseModel = require('./base-model')

const tagSchema = new mongoose.Schema({
  ...baseModel,
  tag: {
    type: String,
    required: true
  }
})

module.exports = tagSchema