const { jwtSecret } = require('../config/config.default')
const { User } = require('../model')
const jwt = require('../util/jwt')

// 用户登录
exports.login = async (req, res, next) => {
  try {
    // 1. 生成token
    const user = req.user.toJSON()
    const token = await jwt.sign({
      userId: user._id
    }, jwtSecret, {
      expiresIn: '15d'
    })
    // 2. 发送成功响应
    delete user.password
    res.status(200).json({
      ...user,
      token
    })
  } catch (error) {
    next(error)
  }
}

// 用户注册
exports.register = async (req, res, next) => {
  try {
    let user = new User(req.body.user)
    await user.save()
    user = user.toJSON()
    delete user.password
    res.status(201).json({ user })
  } catch (error) {
    next(error)
  }
}

// 获取当前登录用户
exports.getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({
      user: req.user
    })
  } catch (error) {
    next(error)
  }
}

// 更新当前登录用户
exports.updateCurrentUser = async (req, res, next) => {
  try {
    let user = req.user
    const updateInfo = req.body?.user || {}
    user.email = updateInfo.email || user.email
    user.bio = updateInfo.bio || user.bio
    user.image = updateInfo.image || user.image
    await user.save()
    res.status(200).json({
      user
    })
  } catch (error) {
    next(error)
  }
}