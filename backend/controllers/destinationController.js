const Destination = require('../models/Destination');

// Get all destinations
exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching destinations',
      error: err.message,
    });
  }
};

// Get single destination
exports.getDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }
    res.status(200).json({
      success: true,
      data: destination,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching destination',
      error: err.message,
    });
  }
};

// Create destination
exports.createDestination = async (req, res) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Destination created successfully',
      data: destination,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Error creating destination',
      error: err.message,
    });
  }
};

// Update destination
exports.updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Destination updated successfully',
      data: destination,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Error updating destination',
      error: err.message,
    });
  }
};

// Delete destination
exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Destination deleted successfully',
      data: destination,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting destination',
      error: err.message,
    });
  }
};
