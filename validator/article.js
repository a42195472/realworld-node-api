const { body } = require('express-validator')
const validate = require('../middleware/validate')
const { Article, Comment, Favorite } = require('../model')

exports.createArticle = validate([
  body('article.title').notEmpty().withMessage('文章标题不能为空'),
  body('article.description').notEmpty().withMessage('文章摘要不能为空'),
  body('article.body').notEmpty().withMessage('文章内容不能为空')
])

exports.getArticle = validate([
  validate.isValidObjectId(['params'], 'articleId')
])

exports.updateArticle = [
  validate([
    validate.isValidObjectId(['params'], 'articleId')
  ]),
  async (req, res, next) => {
    const articleId = req.params.articleId
    const article = await Article.findById(articleId)
    req.article = article
    if (!article) {
      return res.status(404).end()
    }
    next()
  },
  async (req, res, next) => {
    if (req.article.author.toString() !== req.user._id.toString()) {
      return res.status(403).end()
    }
    next()
  }
]

exports.deleteArticle = exports.updateArticle

exports.addArticleComments = [
  validate([
    validate.isValidObjectId(['params'], 'articleId')
  ]),
  validate([
    body('comment.body').notEmpty().withMessage('评价内容不能为空')
  ]),
  async (req, res, next) => {
    const articleId = req.params.articleId
    const article = await Article.findById(articleId)
    req.article = article
    if (!article) {
      return res.status(404).end()
    }
    next()
  }
]

exports.getArticleComments = [
  validate([
    validate.isValidObjectId(['params'], 'articleId')
  ]),
  async (req, res, next) => {
    const articleId = req.params.articleId
    const article = await Article.findById(articleId)
    req.article = article
    if (!article) {
      return res.status(404).end()
    }
    next()
  }
]

exports.deleteArticleComments = [
  validate([
    validate.isValidObjectId(['params'], 'articleId')
  ]),
  async (req, res, next) => {
    const articleId = req.params.articleId
    const article = await Article.findById(articleId)
    req.article = article
    if (!article) {
      return res.status(404).end('当前传递的文章ID不存在')
    }
    next()
  },
  validate([
    validate.isValidObjectId(['params'], 'id')
  ]),
  async (req, res, next) => {
    const id = req.params.id
    const comment = await Comment.findById(id)
    req.comment = comment
    if (!comment) {
      return res.status(404).end('当前传递的评论ID不存在')
    }
    next()
  },
  async (req, res, next) => {
    if (req.comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).end()
    }
    next()
  }
]

exports.favoriteArticle = [
  validate([
    validate.isValidObjectId(['params'], 'articleId')
  ]),
  async (req, res, next) => {
    const { articleId } = req.params
    const favorite = await Favorite.findOne({
      articleId,
      author: req.user._id
    })
    if (favorite) {
      return res.status(404).end('当前文章已经收藏,请勿重复收藏')
    }
    next()
  }
]

exports.unFavoriteArticle = [
  validate([
    validate.isValidObjectId(['params'], 'articleId')
  ]),
  async (req, res, next) => {
    const { articleId } = req.params
    const favorite = await Favorite.findOne({
      articleId,
      author: req.user._id
    })
    if (!favorite) {
      return res.status(404).end('当前文章未收藏,无需取消收藏')
    }
    req.favorite = favorite
    next()
  }
]