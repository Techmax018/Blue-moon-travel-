// --- M-Pesa Payment API ---
const mpesaAPI = {
  initiate: async (phoneNumber, amount, bookingId, userId, destinationName, currency) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/mpesa/initiate',
        {
          phoneNumber,
          amount,
          bookingId,
          userId,
          destinationName,
          currency // Pass the detected currency to the server
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error initiating M-Pesa payment:', error);
      throw error;
    }
  },

  checkStatus: async (bookingId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/mpesa/status/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  }
};

// --- M-Pesa Payment Handler Class ---
class MpesaPaymentHandler {
  constructor() {
    this.currentBookingData = null;
    this.paymentCheckInterval = null;
  }

  openPaymentModal(bookingData) {
    this.currentBookingData = bookingData;
    
    // 1. Get currency from data (Defaults to KES if not provided)
    const currency = bookingData.currency || 'KES';

    // 2. Update UI elements with dynamic currency
    document.getElementById('mpesaSummaryDestination').textContent = bookingData.destinationName;
    document.getElementById('mpesaSummaryDate').textContent = `${new Date(bookingData.startDate).toLocaleDateString()} - ${new Date(bookingData.endDate).toLocaleDateString()}`;
    document.getElementById('mpesaSummaryTravelers').textContent = bookingData.numberOfTravelers;
    
    // Format amounts correctly based on currency
    const formattedPrice = formatCurrency(bookingData.totalPrice, currency);
    document.getElementById('mpesaSummaryAmount').textContent = formattedPrice;
    document.getElementById('mpesaPaymentAmount').textContent = formattedPrice;

    // Show modal and reset
    document.getElementById('mpesaPaymentModal').style.display = 'block';
    document.getElementById('mpesaPaymentForm').reset();
    document.getElementById('mpesaPaymentStatus').style.display = 'none';
  }

  async handlePaymentSubmit(event) {
    event.preventDefault();
    const phoneNumber = document.getElementById('mpesaPhoneNumber').value;
    const submitButton = document.getElementById('mpesaSubmitButton');
    const currency = this.currentBookingData.currency || 'KES';

    if (!this.validatePhoneNumber(phoneNumber)) {
      this.showPaymentError('Please enter a valid Kenyan phone number (e.g., 0712345678)');
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';

    try {
      // 3. Initiate payment with currency included
      const paymentResponse = await mpesaAPI.initiate(
        phoneNumber,
        this.currentBookingData.totalPrice,
        this.currentBookingData.bookingId,
        this.currentBookingData.userId,
        this.currentBookingData.destinationName,
        currency
      );

      if (paymentResponse.success) {
        this.showPaymentProcessing(`Enter M-Pesa PIN on ${phoneNumber} to pay ${formatCurrency(this.currentBookingData.totalPrice, currency)}`);
        this.startPaymentStatusPolling(this.currentBookingData.bookingId);
      } else {
        throw new Error(paymentResponse.message);
      }
    } catch (error) {
      this.showPaymentError(error.message || 'Failed to initiate payment');
      submitButton.disabled = false;
      submitButton.textContent = `Pay ${formatCurrency(this.currentBookingData.totalPrice, currency)}`;
    }
  }

  // --- UI State Management (Processing, Success, Polling) ---

  showPaymentProcessing(message) {
    const overlay = document.getElementById('mpesaLoaderOverlay');
    const mainContent = document.getElementById('mpesaMainContent');
    if(overlay) overlay.style.display = 'flex';
    if(mainContent) mainContent.style.filter = 'blur(2px)';
    
    document.getElementById('loaderContent').innerHTML = `
        <div class="spinner"></div>
        <p class="pulse-text">${message}</p>
        <small id="pollingCountdown">Waiting for PIN...</small>
    `;
  }

  startPaymentStatusPolling(bookingId) {
    let secondsLeft = 120;
    this.paymentCheckInterval = setInterval(async () => {
      secondsLeft--;
      const countdownEl = document.getElementById('pollingCountdown');
      if(countdownEl) {
        const mins = Math.floor(secondsLeft / 60);
        const secs = secondsLeft % 60;
        countdownEl.textContent = `Validating: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }

      try {
        const statusResponse = await mpesaAPI.checkStatus(bookingId);
        if (statusResponse.success && statusResponse.data.status === 'succeeded') {
          clearInterval(this.paymentCheckInterval);
          this.showPaymentSuccess(`Transaction ${statusResponse.data.transactionId} confirmed.`);
          setTimeout(() => { window.location.href = `/confirmation.html?bookingId=${bookingId}`; }, 4000);
        }
      } catch (e) { console.error("Polling error:", e); }

      if (secondsLeft <= 0) {
        clearInterval(this.paymentCheckInterval);
        this.closePaymentModal();
        alert("Payment timeout. Please try again.");
      }
    }, 1000);
  }

  validatePhoneNumber(phoneNumber) {
    return /^(\+?254|0)[17]\d{8}$/.test(phoneNumber);
  }

  closePaymentModal() {
    document.getElementById('mpesaPaymentModal').style.display = 'none';
    const mainContent = document.getElementById('mpesaMainContent');
    if(mainContent) mainContent.style.filter = 'none';
    if (this.paymentCheckInterval) clearInterval(this.paymentCheckInterval);
  }
}

// --- Helper Functions ---
function formatCurrency(amount, currency = 'KES') {
  const locale = currency === 'USD' ? 'en-US' : 'en-KE';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Initialize
const mpesaPaymentHandler = new MpesaPaymentHandler();
