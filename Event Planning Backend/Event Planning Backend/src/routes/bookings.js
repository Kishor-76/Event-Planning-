const express = require('express')
const router = express.Router()
const controller = require('../controllers/bookingController')

router.post('/', controller.createBooking)
router.get('/', controller.getBookings)
router.get('/:id', controller.getBookingById)
router.put('/:id/status', controller.updateBookingStatus)

module.exports = router
