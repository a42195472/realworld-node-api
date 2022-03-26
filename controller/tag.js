const { Tag } = require('../model')

// 获取标签
exports.getTags = async (req, res, next) => {
  try {
    const tags = await Tag.find({}, {_id: 0}).select('tag')
    res.status(200).json({
      tags
    })
  } catch (error) {
    next(error)
  }
}