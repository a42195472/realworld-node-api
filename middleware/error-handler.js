const util = require('util')
module.exports = () => {
  return (error, req, res, next) => {
    res.status(500).json({ error: util.format(error) })
  }
}