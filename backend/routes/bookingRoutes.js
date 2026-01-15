const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  getUserBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  cancelBooking,
} = require('../controllers/bookingController');

// GET all bookings
router.get('/', getAllBookings);

// GET single booking
router.get('/:id', getBooking);

// GET user bookings
router.get('/user/:userId', getUserBookings);

// POST new booking
router.post('/', createBooking);

// PUT update booking
router.put('/:id', updateBooking);

// PUT cancel booking
router.put('/:id/cancel', cancelBooking);

// DELETE booking
router.delete('/:id', deleteBooking);

module.exports = router;
