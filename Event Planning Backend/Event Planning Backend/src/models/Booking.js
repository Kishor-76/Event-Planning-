const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  date: { type: String },
  venue: { type: String },
  guests: { type: Number },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  status: { type: String, default: 'pending' },
}, { timestamps: true })

module.exports = mongoose.model('Booking', BookingSchema)
