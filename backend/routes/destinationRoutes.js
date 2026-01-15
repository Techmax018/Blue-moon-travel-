const express = require('express');
const router = express.Router();
const {
  getAllDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
} = require('../controllers/destinationController');

// GET all destinations
router.get('/', getAllDestinations);

// GET single destination
router.get('/:id', getDestination);

// POST new destination
router.post('/', createDestination);

// PUT update destination
router.put('/:id', updateDestination);

// DELETE destination
router.delete('/:id', deleteDestination);

module.exports = router;
