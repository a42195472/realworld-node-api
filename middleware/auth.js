const { jwtSecret } = require('../config/config.default')
const { User } = require('../model')
const { verify } = require('../util/jwt')
/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
module.exports = async (req, res, next) => {
  // 从请求头获取token数据
  let token = req.headers['authorization']
  token = token ? token.split('Bearer ')[1] : null
  if (!token) {
    // 无效 ---> 响应401
    res.status(401).end()
  }
  // 验证token是否有效
  try {
    const decodedToken = await verify(token, jwtSecret, {
      maxAge: '15d'
    })
    // console.log(decodedToken)
    req.user = await User.findById(decodedToken.userId)
    next()
  } catch (error) {
    // 无效 ---> 响应401
    res.status(401).end()
  }
  // 有效 ---> 把用户信息读取出来挂载到req对象上,往后执行
}