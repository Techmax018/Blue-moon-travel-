const Booking = require('../models/Booking');
const Destination = require('../models/Destination');

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('destinationId', 'name price');
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: err.message,
    });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('destinationId', 'name price');
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user bookings',
      error: err.message,
    });
  }
};

// Get single booking
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('destinationId');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: err.message,
    });
  }
};

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { userId, destinationId, startDate, endDate, numberOfTravelers } =
      req.body;

    // Get destination to calculate total price
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }

    const totalPrice = destination.price * numberOfTravelers;

    const booking = await Booking.create({
      userId,
      destinationId,
      startDate,
      endDate,
      numberOfTravelers,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Error creating booking',
      error: err.message,
    });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Error updating booking',
      error: err.message,
    });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: err.message,
    });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: err.message,
    });
  }
};
