const ActivityLog = require('../models/ActivityLog')

exports.logActivity = async ({ userId, userName, userEmail, action, details }) => {
  try {
    const log = new ActivityLog({
      userId,
      userName,
      userEmail,
      action,
      details,
    })
    await log.save()
    console.log(`[ACTIVITY LOG] ${action} - User: ${userEmail || 'Anonymous'} - Details: ${details}`)
  } catch (err) {
    console.error('Failed to write activity log:', err.message)
  }
}
