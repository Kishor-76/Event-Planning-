const Booking = require('../models/Booking')

exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body)
    const saved = await booking.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('event')
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
