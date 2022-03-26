const { User } = require('../model')

// 获取指定用户资料
exports.getProfilesByUser = async (req, res, next) => {
  try {
    let { username } = req.params
    const profile = await User.findOne({ username })
      .select(['username', 'bio', 'image'])
    res.status(200).json({ profile })
  } catch (error) {
    next(error)
  }
}
// 关注用户
exports.followUser = async (req, res, next) => {
  try {
    const user = req.user
    const followUsers = await User.findById(user._id).select('follows')
    followUsers.follows.push(req.followUser._id)
    user.follows = followUsers.follows
    await user.save()
    res.status(200).json({
      profile: {
        username: req.followUser.username,
        bio: req.followUser.bio,
        image: req.followUser.image,
        following: true
      }
    })
  } catch (error) {
    next(error)
  }
}
// 取消关注用户
exports.unFollowUser = async (req, res, next) => {
  try {
    const user = req.user
    const followUsers = await User.findById(user._id).select('follows')
    const index = followUsers.follows.indexOf(req.unFollowUser._id)
    followUsers.follows.splice(index, 1)
    user.follows = followUsers.follows
    await user.save()
    res.status(200).json({
      profile: {
        username: req.unFollowUser.username,
        bio: req.unFollowUser.bio,
        image: req.unFollowUser.image,
        following: false
      }
    })
  } catch (error) {
    next(error)
  }
}