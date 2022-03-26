const { default: mongoose } = require('mongoose')
const baseModel = require('./base-model')

const commentSchema = new mongoose.Schema({
  ...baseModel,
  body: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  }
})

module.exports = commentSchema