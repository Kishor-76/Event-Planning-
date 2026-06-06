const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'Email already in use' })
    const hashed = await bcrypt.hash(password, 10)
    const user = new User({ email, password: hashed, name })
    const saved = await user.save()
    res.status(201).json({ id: saved._id, email: saved.email, name: saved.name })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '7d' })
    res.json({ token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
