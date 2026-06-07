const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  state: { type: String, default: 'Maharashtra' },
  city: { type: String, default: 'Mumbai' },
  bio: { type: String, default: 'Event enthusiast and planner' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' },
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)
