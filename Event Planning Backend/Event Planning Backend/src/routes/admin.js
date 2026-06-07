const express = require('express')
const router = express.Router()
const ActivityLog = require('../models/ActivityLog')
const Booking = require('../models/Booking')
const User = require('../models/User')

router.get('/dashboard-details', async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 })
    const bookings = await Booking.find().populate('event').sort({ createdAt: -1 })
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json({ logs, bookings, users })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
