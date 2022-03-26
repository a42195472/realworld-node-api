const { Article, User, Comment, Favorite } = require('../model')

//获取文章列表
exports.getArticleLists = async (req, res, next) => {
  try {
    let {
      limit = 5,
      offset = 0,
      tag,
      author,
      favorited
    } = req.query
    limit = Number.parseInt(limit)
    offset = Number.parseInt(offset)
    const filter = {}
    if (tag) {
      filter.tagList = tag
    }
    if (author) {
      const user = await User.findOne({ username: author })
      filter.author = user ? user._id : null
    }
    let articles = await Article.find(filter, {_id: 0})
      .skip(offset)
      .limit(limit)
      .sort({
        createdAt: -1
      })
    const articlesCount = await Article.find(filter).countDocuments()
    res.status(200).json({
      articles,
      articlesCount
    })
  } catch (error) {
    next(error)
  }
}

//获取已关注用户的文章列表
exports.getArticleFeed = async (req, res, next) => {
  try {
    let { limit = 10, offset = 0 } = req.query
    limit = Number.parseInt(limit)
    offset = Number.parseInt(offset)
    const feedUsers = await User.findById(req.user._id).select('follows')

    let articles = await Article.find({
      author: {
        '$in': feedUsers.follows
      }
    }).limit(limit).skip(offset).sort({
      createdAt: 1
    }).populate('author')
    articles = articles.map(c => {
      c = c.toJSON()
      c.author.following = true
      return c
    })
    const articlesCount = await Article.find({
      author: {
        '$in': feedUsers.follows
      }
    }).countDocuments()
    res.status(200).json({
      articles,
      articlesCount
    })
  } catch (error) {
    next(error)
  }
}

//获取一篇文章
exports.getArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.articleId).populate('author')
    if (!article) {
      res.status(404).end()
    }
    res.status(200).json({
      article
    })
  } catch (error) {
    next(error)
  }
}

//创建文章
exports.createArticle = async (req, res, next) => {
  try {
    const article = new Article(req.body.article)
    article.author = req.user._id
    article.populate('author')
    await article.save()
    res.status(201).json({
      article
    })
  } catch (error) {
    next(error)
  }
}

//更新文章
exports.updateArticle = async (req, res, next) => {
  try {
    let article = req.article
    const bodyArticle = req.body.article
    article.title = bodyArticle.title || article.title
    article.description = bodyArticle.description || article.description
    article.body = bodyArticle.body || article.body
    await article.save()
    res.status(200).json({
      article
    })
  } catch (error) {
    next(error)
  }
}

//删除文章
exports.deleteArticle = async (req, res, next) => {
  try {
    let article = req.article
    await article.remove()
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

//文章添加评论
exports.addArticleComments = async (req, res, next) => {
  try {
    const comment = new Comment(req.body.comment)
    comment.author = req.user._id
    comment.articleId = req.article._id
    comment.populate('author')
    await comment.save()
    res.status(201).json({
      comment
    })
  } catch (error) {
    next(error)
  }
}

//获取文章评论
exports.getArticleComments = async (req, res, next) => {
  try {
    const { articleId } = req.params
    const comments = await Comment.find({ articleId }).populate('author')
    res.status(200).json({ comments })
  } catch (error) {
    next(error)
  }
}

//获取文章评论
exports.deleteArticleComments = async (req, res, next) => {
  try {
    let comment = req.comment
    await comment.remove()
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

//收藏文章
exports.favoriteArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params
    const favorite = await new Favorite({
      articleId,
      author: req.user._id
    })
    await favorite.save()
    let article = await Article.findById(articleId).populate('author')
    article = article.toJSON()
    article.favorited = true
    article.favoritesCount = await Favorite.find({ articleId }).countDocuments()
    res.status(200).json({
      article
    })
  } catch (error) {
    next(error)
  }
}

//取消收藏文章
exports.unFavoriteArticle = async (req, res, next) => {
  try {
    let favorite = req.favorite
    const { articleId } = req.params
    await favorite.remove()
    let article = await Article.findById(articleId).populate('author')
    article = article.toJSON()
    article.favorited = false
    article.favoritesCount = await Favorite.find({ articleId }).countDocuments()
    res.status(200).json({
      article
    })
  } catch (error) {
    next(error)
  }
}