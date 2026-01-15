const express = require('express');
const router = express.Router();
const {
  initiateMpesaPayment,
  handleMpesaCallback,
  checkMpesaStatus,
  queryMpesaTransactionStatus,
  getAllPayments,
} = require('../controllers/mpesaController');

// POST initiate M-Pesa payment (STK Push)
router.post('/initiate', initiateMpesaPayment);

// POST M-Pesa callback (Webhook from Safaricom)
router.post('/callback', handleMpesaCallback);

// GET check payment status
router.get('/status/:bookingId', checkMpesaStatus);

// POST query transaction status
router.post('/query', queryMpesaTransactionStatus);

// GET all M-Pesa payments (admin only)
router.get('/', getAllPayments);

module.exports = router;
