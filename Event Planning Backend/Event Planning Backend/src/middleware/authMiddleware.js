const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' })
  const token = authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret')
    req.userId = payload.id
    next()
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
  }
}
