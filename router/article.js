const express = require('express')
const articleCtrl = require('../controller/article')
const auth = require('../middleware/auth')
const articleValidator = require('../validator/article')
const router = express.Router()

// 获取文章列表
router.get('/', articleCtrl.getArticleLists)

// 返回
router.get('/feed', auth, articleCtrl.getArticleFeed)

// 获取一篇文章
router.get('/:articleId', articleValidator.getArticle, articleCtrl.getArticle)

// 创建文章
router.post('/', auth, articleValidator.createArticle, articleCtrl.createArticle)

// 更新文章
router.put('/:articleId', auth, articleValidator.updateArticle, articleCtrl.updateArticle)

// 删除文章
router.delete('/:articleId',auth, articleValidator.deleteArticle , articleCtrl.deleteArticle)

// 文章添加评论
router.post('/:articleId/comments', auth, articleValidator.addArticleComments, articleCtrl.addArticleComments)

// 获取文章评论
router.get('/:articleId/comments', articleValidator.getArticleComments, articleCtrl.getArticleComments)

// 删除文章评论
router.delete('/:articleId/comments/:id', auth, articleValidator.deleteArticleComments, articleCtrl.deleteArticleComments)

// 收藏文章
router.post('/:articleId/favorite', auth, articleValidator.favoriteArticle, articleCtrl.favoriteArticle)

// 取消收藏文章
router.delete('/:articleId/favorite', auth, articleValidator.unFavoriteArticle, articleCtrl.unFavoriteArticle)
module.exports = router