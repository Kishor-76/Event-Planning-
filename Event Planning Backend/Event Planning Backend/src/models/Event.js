const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: String },
  venue: { type: String },
  description: { type: String },
  image: { type: String },
  capacity: { type: Number },
}, { timestamps: true })

module.exports = mongoose.model('Event', EventSchema)
