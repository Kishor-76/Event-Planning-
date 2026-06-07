const mongoose = require('mongoose')

const ActivityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  userName: { type: String },
  userEmail: { type: String },
  action: { type: String, required: true }, // 'REGISTER', 'LOGIN', 'LOGOUT', 'CREATE_BOOKING'
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
})

module.exports = mongoose.model('ActivityLog', ActivityLogSchema)
