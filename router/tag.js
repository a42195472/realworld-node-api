const express = require('express')
const tagsCtrl = require('../controller/tag')

const router = express.Router()

// 获取标签
router.get('/tags', tagsCtrl.getTags)

module.exports = router