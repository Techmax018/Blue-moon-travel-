// --- M-Pesa Payment API ---
const mpesaAPI = {
  initiate: async (phoneNumber, amount, bookingId, userId, destinationName, currency) => {
    try {
      const response = await axios.post('http://localhost:5000/api/mpesa/initiate', {
        phoneNumber,
        amount,
        bookingId,
        userId,
        destinationName,
        currency,
      });
      return response.data;
    } catch (error) {
      console.error('Error initiating M-Pesa payment:', error);
      throw error;
    }
  },

  checkStatus: async (bookingId) => {
    try {
      const url = bookingId ? `http://localhost:5000/api/mpesa/status/${bookingId}` : 'http://localhost:5000/api/mpesa/status';
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  },
};

// --- M-Pesa Payment Handler Class ---
class MpesaPaymentHandler {
  constructor() {
    this.currentBookingData = null;
    this.paymentCheckInterval = null;
    this.selectedMethod = 'mpesa';
  }

  setPaymentMethod(method) {
    this.selectedMethod = method;
  }

  openPaymentModal(bookingData) {
    this.currentBookingData = bookingData;
    this.selectedMethod = 'mpesa';
    const currency = bookingData.currency || 'KES';
    const startDate = bookingData.startDate ? new Date(bookingData.startDate).toLocaleDateString() : '';
    const endDate = bookingData.endDate ? new Date(bookingData.endDate).toLocaleDateString() : startDate;

    const destinationEl = document.getElementById('mpesaSummaryDestination');
    if (destinationEl) destinationEl.textContent = bookingData.destinationName || '--';

    const dateEl = document.getElementById('mpesaSummaryDate');
    if (dateEl) dateEl.textContent = endDate ? `${startDate} - ${endDate}` : startDate;

    const travelersEl = document.getElementById('mpesaSummaryTravelers');
    if (travelersEl) travelersEl.textContent = bookingData.numberOfTravelers || 1;

    const formattedPrice = formatCurrency(bookingData.totalPrice || 0, currency);
    const amountEl = document.getElementById('mpesaSummaryAmount');
    if (amountEl) amountEl.textContent = formattedPrice;

    const btnAmount = document.getElementById('btnAmount');
    if (btnAmount) {
        btnAmount.textContent = formattedPrice;
    }
    const mpesaPaymentAmount = document.getElementById('mpesaPaymentAmount');
    if (mpesaPaymentAmount) {
        mpesaPaymentAmount.textContent = formattedPrice;
    }

    if (typeof window.selectPaymentMethod === 'function') {
      window.selectPaymentMethod('mpesa');
    }

    const paymentStatus = document.getElementById('mpesaPaymentStatus');
    if (paymentStatus) {
      paymentStatus.style.display = 'none';
      paymentStatus.textContent = '';
      paymentStatus.classList.remove('error', 'success');
    }

    const overlay = document.getElementById('mpesaLoaderOverlay');
    const mainContent = document.getElementById('mpesaMainContent');
    if (overlay) {
      overlay.style.display = 'none';
    }
    if (mainContent) {
      mainContent.style.filter = 'none';
      mainContent.style.display = 'block';
    }

    const formEl = document.getElementById('mpesaPaymentForm');
    if (formEl) formEl.reset();
    const modalEl = document.getElementById('mpesaPaymentModal');
    if (modalEl) modalEl.style.display = 'flex';
  }

  async handlePaymentSubmit(event) {
    event.preventDefault();
    const submitButton = document.getElementById('mpesaSubmitButton');
    const currency = this.currentBookingData?.currency || 'KES';
    const defaultButtonText = submitButton?.dataset.defaultText || (submitButton?.textContent || 'Pay Now');

    const method = this.selectedMethod || 'mpesa';
    if (method !== 'mpesa') {
      if (!this.validateAlternativeMethod(method)) return;
      if (submitButton) {
        submitButton.dataset.defaultText = defaultButtonText;
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';
      }
      setTimeout(() => {
        this.showPaymentSuccess(`Payment completed via ${method.toUpperCase()}.`);
        if (typeof window.onMpesaPaymentSuccess === 'function') {
          window.onMpesaPaymentSuccess({
            bookingId: this.currentBookingData?.bookingId,
            transactionId: `${method.toUpperCase()}-${Date.now()}`,
          });
        }
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = defaultButtonText;
        }
      }, 1500);
      return;
    }

    const phoneNumber = document.getElementById('mpesaPhoneNumber')?.value?.trim();
    if (!this.validatePhoneNumber(phoneNumber)) {
      this.showPaymentError('Please enter a valid Kenyan phone number (e.g., 0712345678)');
      return;
    }

    if (submitButton) {
      submitButton.dataset.defaultText = defaultButtonText;
      submitButton.disabled = true;
      submitButton.textContent = 'Processing...';
    }

    try {
      const paymentResponse = await mpesaAPI.initiate(
        phoneNumber,
        this.currentBookingData?.totalPrice || 0,
        this.currentBookingData?.bookingId,
        this.currentBookingData?.userId,
        this.currentBookingData?.destinationName,
        currency
      );

      if (paymentResponse?.success) {
        this.showPaymentProcessing(`Enter your M-Pesa PIN on ${phoneNumber} to pay ${formatCurrency(this.currentBookingData.totalPrice || 0, currency)}`);
        this.startPaymentStatusPolling(this.currentBookingData?.bookingId);
      } else {
        throw new Error(paymentResponse?.message || 'Payment initiation failed.');
      }
    } catch (error) {
      this.showPaymentError(error?.message || 'Failed to initiate payment');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = defaultButtonText;
      }
    }
  }

  showPaymentProcessing(message) {
    const overlay = document.getElementById('mpesaLoaderOverlay');
    const mainContent = document.getElementById('mpesaMainContent');
    if (overlay) overlay.style.display = 'flex';
    if (mainContent) mainContent.style.filter = 'blur(2px)';

    const statusText = overlay.querySelector('.status-text');
    const countdownEl = overlay.querySelector('#pollingCountdown');
    if (statusText) statusText.textContent = message;
    if (countdownEl) countdownEl.textContent = 'Waiting for confirmation...';
  }

  showPaymentSuccess(message) {
    const overlay = document.getElementById('mpesaLoaderOverlay');
    if (overlay) overlay.style.display = 'none';
    const status = document.getElementById('mpesaPaymentStatus');
    if (status) {
      status.style.display = 'block';
      status.textContent = message;
      status.classList.remove('error');
      status.classList.add('success');
    }
  }

  showPaymentError(message) {
    const status = document.getElementById('mpesaPaymentStatus');
    if (status) {
      status.style.display = 'block';
      status.textContent = message;
      status.classList.remove('success');
      status.classList.add('error');
    } else {
      alert(message);
    }
  }

  startPaymentStatusPolling(bookingId) {
    let secondsLeft = 120;
    this.paymentCheckInterval = setInterval(async () => {
      secondsLeft -= 1;
      const countdownEl = document.getElementById('pollingCountdown');
      if (countdownEl) {
        const mins = Math.floor(secondsLeft / 60);
        const secs = secondsLeft % 60;
        countdownEl.textContent = `Validating: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }

      try {
        const statusResponse = await mpesaAPI.checkStatus(bookingId);
        if (statusResponse?.success && statusResponse?.data?.status === 'succeeded') {
          clearInterval(this.paymentCheckInterval);
          this.showPaymentSuccess(`Transaction ${statusResponse.data.transactionId} confirmed.`);
          if (typeof window.onMpesaPaymentSuccess === 'function') {
            window.onMpesaPaymentSuccess({
              bookingId,
              transactionId: statusResponse.data.transactionId,
            });
          }
        }
      } catch (e) {
        console.error('Polling error:', e);
      }

      if (secondsLeft <= 0) {
        clearInterval(this.paymentCheckInterval);
        this.closePaymentModal();
        alert('Payment timeout. Please try again.');
      }
    }, 1000);
  }

  validatePhoneNumber(phoneNumber) {
    return /^(\+?254|0)[17]\d{8}$/.test(phoneNumber);
  }

  validateAlternativeMethod(method) {
    if (method === 'card') {
      const name = document.getElementById('cardholderName')?.value?.trim();
      const card = document.getElementById('cardNumber')?.value?.trim();
      const expiry = document.getElementById('cardExpiry')?.value?.trim();
      const cvv = document.getElementById('cardCvv')?.value?.trim();
      if (!name || !card || !expiry || !cvv) {
        this.showPaymentError('Please complete all card details.');
        return false;
      }
      return true;
    }
    if (method === 'paypal') {
      const email = document.getElementById('paypalEmail')?.value?.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!valid) {
        this.showPaymentError('Please enter a valid PayPal email address.');
        return false;
      }
      return true;
    }
    if (method === 'bank') {
      const bank = document.getElementById('bankName')?.value?.trim();
      const accountName = document.getElementById('accountName')?.value?.trim();
      const accountNumber = document.getElementById('accountNumber')?.value?.trim();
      if (!bank || !accountName || !accountNumber) {
        this.showPaymentError('Please complete all bank transfer details.');
        return false;
      }
      return true;
    }
    return true;
  }

  closePaymentModal() {
    const modal = document.getElementById('mpesaPaymentModal');
    const mainContent = document.getElementById('mpesaMainContent');
    if (modal) modal.style.display = 'none';
    if (mainContent) mainContent.style.filter = 'none';
    if (this.paymentCheckInterval) clearInterval(this.paymentCheckInterval);
  }
}

function formatCurrency(amount, currency = 'KES') {
  const locale = currency === 'USD' ? 'en-US' : 'en-KE';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

const mpesaPaymentHandler = new MpesaPaymentHandler();
