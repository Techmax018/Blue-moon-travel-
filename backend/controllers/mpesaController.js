const axios = require('axios');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// M-Pesa Configuration
const MPESA_BASE_URL = process.env.MPESA_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

const BUSINESS_SHORTCODE = process.env.MPESA_SHORTCODE;
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const PASSKEY = process.env.MPESA_PASSKEY;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL;

// Get M-Pesa Access Token
const getMpesaAccessToken = async () => {
  try {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    
    const response = await axios.get(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting M-Pesa access token:', error.message);
    throw new Error('Failed to get M-Pesa access token');
  }
};

// Initiate M-Pesa STK Push (Lipa Na M-Pesa Online)
exports.initiateMpesaPayment = async (req, res) => {
  try {
    const { phoneNumber, amount, bookingId, userId, destinationName } = req.body;

    // Validate booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Get access token
    const accessToken = await getMpesaAccessToken();

    // Format phone number (remove + or 0, ensure it starts with 254)
    const formattedPhone = phoneNumber
      .replace(/^\+/, '')
      .replace(/^0/, '254')
      .replace(/^254/, '254');

    // Generate timestamp
    const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');

    // Generate password
    const dataToEncode = `${BUSINESS_SHORTCODE}${PASSKEY}${timestamp}`;
    const password = Buffer.from(dataToEncode).toString('base64');

    // Create payment record
    const payment = await Payment.create({
      bookingId,
      userId,
      amount,
      currency: 'KES',
      paymentMethod: 'mpesa',
      status: 'pending',
      metadata: {
        phoneNumber: formattedPhone,
        destinationName,
      },
    });

    try {
      // Initiate STK Push
      const response = await axios.post(
        `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: BUSINESS_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Math.round(amount),
          PartyA: formattedPhone,
          PartyB: BUSINESS_SHORTCODE,
          PhoneNumber: formattedPhone,
          CallBackURL: CALLBACK_URL,
          AccountReference: `BOOKING-${bookingId}`,
          TransactionDesc: `Travel booking for ${destinationName}`,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Update payment with checkout request ID
      payment.metadata.checkoutRequestId = response.data.CheckoutRequestID;
      payment.metadata.responseCode = response.data.ResponseCode;
      await payment.save();

      res.status(201).json({
        success: true,
        message: 'M-Pesa payment initiated',
        data: {
          paymentId: payment._id,
          checkoutRequestId: response.data.CheckoutRequestID,
          responseCode: response.data.ResponseCode,
          responseDescription: response.data.ResponseDescription,
        },
      });
    } catch (stkError) {
      payment.status = 'failed';
      payment.failureReason = stkError.response?.data?.errorMessage || stkError.message;
      await payment.save();

      return res.status(400).json({
        success: false,
        message: 'Failed to initiate M-Pesa payment',
        error: stkError.response?.data || stkError.message,
      });
    }
  } catch (err) {
    console.error('Error in initiateMpesaPayment:', err);
    res.status(400).json({
      success: false,
      message: 'Error initiating M-Pesa payment',
      error: err.message,
    });
  }
};

// Handle M-Pesa Callback
exports.handleMpesaCallback = async (req, res) => {
  try {
    const data = req.body.Body.stkCallback;

    // Log callback for debugging
    console.log('M-Pesa Callback:', JSON.stringify(data, null, 2));

    // Acknowledge receipt
    res.json({});

    // Process callback asynchronously
    if (data.ResultCode === 0) {
      // Payment successful
      const callbackMetadata = data.CallbackMetadata.Item;
      const phoneNumber = callbackMetadata.find(
        (item) => item.Name === 'PhoneNumber'
      )?.Value;
      const mpesaReceiptNumber = callbackMetadata.find(
        (item) => item.Name === 'MpesaReceiptNumber'
      )?.Value;
      const transactionAmount = callbackMetadata.find(
        (item) => item.Name === 'Amount'
      )?.Value;
      const transactionDate = callbackMetadata.find(
        (item) => item.Name === 'TransactionDate'
      )?.Value;

      // Extract booking ID from description
      const bookingId = data.CheckoutRequestID.split('-')[1];

      // Update payment
      await Payment.findOneAndUpdate(
        { bookingId },
        {
          status: 'succeeded',
          transactionId: mpesaReceiptNumber,
          metadata: {
            checkoutRequestId: data.CheckoutRequestID,
            phoneNumber,
            mpesaReceiptNumber,
            transactionAmount,
            transactionDate,
          },
        }
      );

      // Update booking
      await Booking.findByIdAndUpdate(bookingId, {
        status: 'confirmed',
        paymentStatus: 'paid',
      });
    } else {
      // Payment failed
      const bookingId = data.CheckoutRequestID.split('-')[1];
      
      await Payment.findOneAndUpdate(
        { bookingId },
        {
          status: 'failed',
          failureReason: data.ResultDesc || 'Payment cancelled by user',
        }
      );
    }
  } catch (error) {
    console.error('Error handling M-Pesa callback:', error);
  }
};

// Check M-Pesa Payment Status
exports.checkMpesaStatus = async (req, res) => {
  try {
    const payment = await Payment.findOne({ bookingId: req.params.bookingId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        status: payment.status,
        amount: payment.amount,
        transactionId: payment.transactionId,
        createdAt: payment.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking payment status',
      error: error.message,
    });
  }
};

// Get M-Pesa Transaction Status (Query API)
exports.queryMpesaTransactionStatus = async (req, res) => {
  try {
    const { checkoutRequestId } = req.body;

    const accessToken = await getMpesaAccessToken();
    const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dataToEncode = `${BUSINESS_SHORTCODE}${PASSKEY}${timestamp}`;
    const password = Buffer.from(dataToEncode).toString('base64');

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
      {
        BusinessShortCode: BUSINESS_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error('Error querying M-Pesa status:', error);
    res.status(400).json({
      success: false,
      message: 'Error querying transaction status',
      error: error.response?.data || error.message,
    });
  }
};

// Get all M-Pesa payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ paymentMethod: 'mpesa' })
      .populate('userId', 'name email phone')
      .populate('bookingId', 'destinationId startDate endDate');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message,
    });
  }
};
