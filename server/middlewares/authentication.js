const jwt = require('jsonwebtoken')

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.headers.authorization
    if(!token) {
      return res.status(401).json({message: "لم يتم توفير رمز الدخول"})
    }
    const deCoded = jwt.verify(token, process.env.JWT)
    req.currentUser = deCoded
    return next()
  } catch (error) {
    return res.status(500).json(error)
  }
}

module.exports = isLoggedIn