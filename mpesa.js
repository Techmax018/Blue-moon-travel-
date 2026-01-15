// M-Pesa Payment API
const mpesaAPI = {
  // Initiate M-Pesa payment
  initiate: async (phoneNumber, amount, bookingId, userId, destinationName) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/mpesa/initiate',
        {
          phoneNumber,
          amount,
          bookingId,
          userId,
          destinationName,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error initiating M-Pesa payment:', error);
      throw error;
    }
  },

  // Check payment status
  checkStatus: async (bookingId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/mpesa/status/${bookingId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  },

  // Query transaction status
  queryStatus: async (checkoutRequestId) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/mpesa/query',
        { checkoutRequestId }
      );
      return response.data;
    } catch (error) {
      console.error('Error querying transaction status:', error);
      throw error;
    }
  },

  // Get all payments
  getAll: async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/mpesa');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },
};

// M-Pesa Payment Handler
class MpesaPaymentHandler {
  constructor() {
    this.currentBookingData = null;
    this.paymentCheckInterval = null;
  }

  // Open M-Pesa payment modal
  openPaymentModal(bookingData) {
    this.currentBookingData = bookingData;

    // Update booking summary
    document.getElementById('mpesaSummaryDestination').textContent =
      bookingData.destinationName;
    document.getElementById('mpesaSummaryDate').textContent = `${new Date(
      bookingData.startDate
    ).toLocaleDateString()} - ${new Date(bookingData.endDate).toLocaleDateString()}`;
    document.getElementById('mpesaSummaryTravelers').textContent =
      bookingData.numberOfTravelers;
    document.getElementById('mpesaSummaryAmount').textContent = formatCurrency(
      bookingData.totalPrice,
      'KES'
    );
    document.getElementById('mpesaPaymentAmount').textContent = formatCurrency(
      bookingData.totalPrice,
      'KES'
    );

    // Show modal
    document.getElementById('mpesaPaymentModal').style.display = 'block';
    
    // Reset form
    document.getElementById('mpesaPaymentForm').reset();
    document.getElementById('mpesaPaymentStatus').style.display = 'none';
  }

  // Close payment modal
  closePaymentModal() {
    document.getElementById('mpesaPaymentModal').style.display = 'none';
    if (this.paymentCheckInterval) {
      clearInterval(this.paymentCheckInterval);
    }
  }

  // Handle payment form submission
  async handlePaymentSubmit(event) {
    event.preventDefault();

    const phoneNumber = document.getElementById('mpesaPhoneNumber').value;
    const submitButton = document.getElementById('mpesaSubmitButton');

    // Validate phone number
    if (!this.validatePhoneNumber(phoneNumber)) {
      this.showPaymentError('Please enter a valid Kenyan phone number (e.g., 0712345678)');
      return;
    }

    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';

    try {
      // Initiate M-Pesa payment
      const paymentResponse = await mpesaAPI.initiate(
        phoneNumber,
        this.currentBookingData.totalPrice,
        this.currentBookingData.bookingId,
        this.currentBookingData.userId,
        this.currentBookingData.destinationName
      );

      if (paymentResponse.success) {
        this.showPaymentProcessing(
          `Enter your M-Pesa PIN to complete the payment. You should receive a prompt on ${phoneNumber}`
        );

        // Start polling for payment status
        this.startPaymentStatusPolling(this.currentBookingData.bookingId);
      } else {
        this.showPaymentError(
          paymentResponse.message || 'Failed to initiate M-Pesa payment'
        );
        submitButton.disabled = false;
        submitButton.textContent = `Pay ${formatCurrency(
          this.currentBookingData.totalPrice,
          'KES'
        )}`;
      }
    } catch (error) {
      console.error('Payment Error:', error);
      this.showPaymentError(
        error.response?.data?.message || 'Failed to initiate payment. Please try again.'
      );
      submitButton.disabled = false;
      submitButton.textContent = `Pay ${formatCurrency(
        this.currentBookingData.totalPrice,
        'KES'
      )}`;
    }
  }

  // Poll for payment status
  startPaymentStatusPolling(bookingId) {
    let checkCount = 0;
    const maxChecks = 120; // 2 minutes with 1 second intervals

    this.paymentCheckInterval = setInterval(async () => {
      checkCount++;

      try {
        const statusResponse = await mpesaAPI.checkStatus(bookingId);

        if (statusResponse.success && statusResponse.data.status === 'succeeded') {
          clearInterval(this.paymentCheckInterval);
          this.showPaymentSuccess(
            `Payment successful! Your booking is confirmed. Transaction ID: ${statusResponse.data.transactionId}`
          );

          setTimeout(() => {
            this.closePaymentModal();
            window.location.href = `/confirmation.html?bookingId=${bookingId}`;
          }, 3000);
        } else if (statusResponse.success && statusResponse.data.status === 'failed') {
          clearInterval(this.paymentCheckInterval);
          this.showPaymentError('Payment failed. Please try again.');
          document.getElementById('mpesaSubmitButton').disabled = false;
          document.getElementById('mpesaSubmitButton').textContent = `Pay ${formatCurrency(
            this.currentBookingData.totalPrice,
            'KES'
          )}`;
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }

      // Stop polling after max checks
      if (checkCount >= maxChecks) {
        clearInterval(this.paymentCheckInterval);
        this.showPaymentError(
          'Payment timeout. Please check your phone or try again.'
        );
        document.getElementById('mpesaSubmitButton').disabled = false;
        document.getElementById('mpesaSubmitButton').textContent = `Pay ${formatCurrency(
          this.currentBookingData.totalPrice,
          'KES'
        )}`;
      }
    }, 1000);
  }

  // Validate phone number
  validatePhoneNumber(phoneNumber) {
    // Accept formats: 0712345678, 254712345678, +254712345678
    const phoneRegex = /^(\+?254|0)[17]\d{8}$/;
    return phoneRegex.test(phoneNumber);
  }

  // Show payment processing message
  showPaymentProcessing(message) {
    const statusDiv = document.getElementById('mpesaPaymentStatus');
    statusDiv.className = 'processing';
    statusDiv.style.display = 'block';
    document.getElementById('mpesaPaymentStatusMessage').innerHTML = `
      <div style="text-align: center;">
        <p style="margin-bottom: 10px;">${message}</p>
        <div class="spinner"></div>
      </div>
    `;
  }

  // Show payment success
  showPaymentSuccess(message) {
    const statusDiv = document.getElementById('mpesaPaymentStatus');
    statusDiv.className = 'success';
    statusDiv.style.display = 'block';
    document.getElementById('mpesaPaymentStatusMessage').textContent = message;
  }

  // Show payment error
  showPaymentError(message) {
    const statusDiv = document.getElementById('mpesaPaymentStatus');
    statusDiv.className = 'error';
    statusDiv.style.display = 'block';
    document.getElementById('mpesaPaymentStatusMessage').textContent = `Error: ${message}`;
  }
}

// Initialize handler
const mpesaPaymentHandler = new MpesaPaymentHandler();

// Helper function to format currency
function formatCurrency(amount, currency = 'KES') {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}
