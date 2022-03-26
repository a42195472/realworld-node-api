const { param } = require('express-validator')
const validate = require('../middleware/validate')
const { User } = require('../model')

exports.followUser = validate([
  param('username').custom(async (username, { req }) => {
    const user = await User.findOne({ username })
    if (!user) {
      return Promise.reject('当前想要关注的用户不存在')
    }
    const isFollows = await User.find({ follows: user._id }).countDocuments()
    if (isFollows) {
      return Promise.reject('您已经关注该用户, 无法重复关注')
    }
    // if (user._id.toString() === req.user._id.toString()) {
    //   return Promise.reject('暂时不能关注自己')
    // }
    req.followUser = user
  })
])

exports.unFollowUser = validate([
  param('username').custom(async (username, { req }) => {
    const user = await User.findOne({ username })
    if (!user) {
      return Promise.reject('当前想要取消关注的用户不存在')
    }
    const isFollows = await User.find({ follows: user._id }).countDocuments()
    if (!isFollows) {
      return Promise.reject('您已经取消关注该用户, 无需重复取消')
    }
    // if (user._id.toString() === req.user._id.toString()) {
    //   return Promise.reject('暂时不能关注自己')
    // }
    req.unFollowUser = user
  })
])