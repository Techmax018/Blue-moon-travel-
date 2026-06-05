// payment.js — modal behavior for standalone payment page
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('paymentModal');
  const backBtn = document.getElementById('backToBooking');
  const form = document.getElementById('mpesaPaymentForm');
  const closeBtn = document.getElementById('closePaymentModal');

  // Ensure modal is visible
  if (modal) modal.style.display = 'flex';

  // Click outside modal content closes and returns
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      try { localStorage.removeItem('pendingBookingData'); } catch (err) {}
      window.location.href = 'booking.html';
    }
  });

  // Back button: clear pending data and go back
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      try { localStorage.removeItem('pendingBookingData'); } catch (err) {}
      window.location.href = 'booking.html';
    });
  }

  // Close icon handler
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      try { localStorage.removeItem('pendingBookingData'); } catch (err) {}
      window.location.href = 'booking.html';
    });
  }

  // ESC key closes modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      try { localStorage.removeItem('pendingBookingData'); } catch (err) {}
      window.location.href = 'booking.html';
    }
  });

  // Attach form submit to mpesa handler if available
  if (form && typeof mpesaPaymentHandler !== 'undefined') {
    form.addEventListener('submit', (ev) => mpesaPaymentHandler.handlePaymentSubmit(ev));
  }
});
