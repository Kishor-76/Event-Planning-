const Booking = require('../models/Booking')
const { logActivity } = require('../utils/activityLogger')
const User = require('../models/User')

exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body)
    const saved = await booking.save()

    const user = await User.findOne({ email: req.body.email })
    await logActivity({
      userId: user ? user._id : null,
      userName: req.body.name,
      userEmail: req.body.email,
      action: 'CREATE_BOOKING',
      details: `Created a booking at ${req.body.venue || 'TBD'} for date ${req.body.date} with ${req.body.guests || 0} guests`,
    })

    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.getBookings = async (req, res) => {
  try {
    const { email } = req.query
    const filter = {}
    if (email) {
      filter.email = email
    }
    const bookings = await Booking.find(filter).populate('event')
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('event')
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.json(booking)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    res.json(booking)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}
