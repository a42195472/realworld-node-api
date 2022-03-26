const express = require('express')
const profileCtrl = require('../controller/profile')
const auth = require('../middleware/auth')
const profileValidator = require('../validator/profile')
const router = express.Router()

// 获取指定用户资料
router.get('/:username', profileCtrl.getProfilesByUser)

// 关注用户
router.post('/:username/follow', auth, profileValidator.followUser, profileCtrl.followUser)

// 取消关注用户
router.delete('/:username/follow', auth, profileValidator.unFollowUser, profileCtrl.unFollowUser)

module.exports = router