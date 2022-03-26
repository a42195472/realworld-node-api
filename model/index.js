const mongoose = require('mongoose')
const { dbUrl } = require('../config/config.default')

// 链接MongoDB数据库
mongoose.connect(dbUrl)
const db = mongoose.connection

db.on('error', err => {
  console.error.bind(console, 'connection error:', err)
})
db.once('open', () => {
  console.log('数据库链接成功')
})

// 组织导出模型类
module.exports = {
  User: mongoose.model('User', require('./user')),
  Article: mongoose.model('Article', require('./article')),
  Comment: mongoose.model('Comment', require('./comment')),
  Favorite: mongoose.model('Favorite', require('./favorite')),
  Tag: mongoose.model('Tag', require('./tag'))
}