document.addEventListener('DOMContentLoaded', () => {
    // --- M-Pesa Form Listener ---
    const mpesaForm = document.getElementById('mpesaPaymentForm');
    if (mpesaForm && typeof mpesaPaymentHandler !== 'undefined') {
        mpesaForm.addEventListener('submit', (e) => mpesaPaymentHandler.handlePaymentSubmit(e));
    }

    // --- Hamburger Menu ---
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navbar = document.getElementById('navbar');

    if (hamburgerMenu && navbar) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            navbar.classList.toggle('active');
        });

        navbar.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navbar.classList.contains('active')) {
                    hamburgerMenu.classList.remove('active');
                    navbar.classList.remove('active');
                }
            });
        });
    }

    // --- Scroll to Top ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            scrollToTopBtn.style.display = (window.scrollY > 200) ? 'block' : 'none';
        });
        scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // --- Data Definitions ---
    // (real trip arrays are defined further below)

    // --- Generic Render Function ---
    function renderTrips(tripsToRender, gridElement, noResultsElement, currencySymbol = '$') {
        if (!gridElement) return;
        gridElement.innerHTML = '';
        if (tripsToRender.length === 0) {
            noResultsElement.style.display = 'block';
            return;
        }
        noResultsElement.style.display = 'none';

        tripsToRender.forEach(trip => {
            const tripCard = document.createElement('div');
            tripCard.classList.add('trip-card');
            tripCard.innerHTML = `
                <img src="${trip.image}" alt="${trip.title}">
                <div class="trip-card-content">
                    <h3>${trip.title}</h3>
                    <p class="description">${trip.description}</p>
                    <p class="price">Starting from ${currencySymbol}${trip.price.toLocaleString()}</p>
                    <button class="btn btn-primary view-details-btn">View Details</button>
                </div>
            `;
            gridElement.appendChild(tripCard);
            tripCard.querySelector('.view-details-btn').addEventListener('click', () => {
                const bookingData = createBookingDataFromTrip(trip, currencySymbol);
                openBookingConfirmationModal(bookingData);
            });
        });
    }

    // --- Booking Prompt Section ---
    const bookingPromptSection = document.querySelector('.booking-prompt');
    if (bookingPromptSection) {
        bookingPromptSection.style.display = 'none';
        // disable inputs while hidden to avoid browser validation on hidden controls
        bookingPromptSection.querySelectorAll('input, select, textarea, button').forEach(el => el.disabled = true);
    }

    // --- Data Definitions ---
    const internationalTrips = [
        {
            title: 'Paris Escape',
            description: 'Enjoy 5 nights in Paris with the Eiffel Tower, Seine cruise, and local dining.',
            price: 2299,
            image: 'https://images.unsplash.com/photo-1522098543979-ffc7f79d3c0b?auto=format&fit=crop&w=900&q=80',
            highlights: ['Eiffel Tower visit', 'Seine river cruise', 'Culinary walking tour'],
            duration: '5 Days',
            type: 'Romance',
            currency: 'USD'
        },
        {
            title: 'Safari Adventure',
            description: '7-day Kenyan safari exploring Masai Mara with guided game drives and camp stays.',
            price: 1899,
            image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=900&q=80',
            highlights: ['Big Five game drive', 'Cultural village visit', 'Luxury tented accommodation'],
            duration: '7 Days',
            type: 'Wildlife',
            currency: 'USD'
        },
        {
            title: 'Mediterranean Cruise',
            description: '10-day cruise along the Mediterranean coast with island stops and entertainment.',
            price: 2999,
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
            highlights: ['Oceanfront cabin', 'Island excursions', 'Fine dining experiences'],
            duration: '10 Days',
            type: 'Luxury',
            currency: 'USD'
        }
    ];

    const localTrips = [
        {
            title: 'Maasai Mara Safari',
            description: '3-day wildlife safari in Maasai Mara with morning and evening game drives.',
            price: 75000,
            image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
            highlights: ['Three game drives', 'Traditional Maasai village tour', 'Luxury tented camp'],
            duration: '3 Days',
            type: 'Safari',
            currency: 'KES'
        },
        {
            title: 'Diani Beach Retreat',
            description: '4-day coastal getaway with snorkeling, beach dinners, and ocean views.',
            price: 54000,
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
            highlights: ['Oceanfront resort', 'Snorkeling excursion', 'Sunset beach dinner'],
            duration: '4 Days',
            type: 'Beach',
            currency: 'KES'
        },
        {
            title: 'Mount Kenya Trek',
            description: '5-day guided trek across Mount Kenya with stunning scenery and camping.',
            price: 68000,
            image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
            highlights: ['Guided mountain trek', 'Camping under the stars', 'Wildlife spotting'],
            duration: '5 Days',
            type: 'Mountain',
            currency: 'KES'
        }
    ];

    window.showBookingForm = function() {
        const packageSection = document.getElementById('international-destinations');
        if (packageSection) {
            packageSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // --- Search & Initial Render ---
    renderTrips(internationalTrips, document.getElementById('international-trip-grid'), document.getElementById('no-international-results'), '$');
    renderTrips(localTrips, document.getElementById('local-trip-grid'), document.getElementById('no-local-results'), 'KES ');

    // --- Booking Entry Form ---
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            document.querySelector('.booking-prompt').style.display = 'none';
            document.querySelector('.container').style.display = 'block';
        });
    }
});
let pendingBookingData = null;

function createBookingDataFromTrip(trip, currencySymbol) {
    return {
        bookingId: `booking_${Date.now()}`,
        destinationName: trip.title,
        basePrice: trip.price,
        totalPrice: trip.price,
        currency: trip.currency || (currencySymbol.trim() === '$' ? 'USD' : 'KES'),
        numberOfTravelers: 1,
        startDate: new Date().toLocaleDateString(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };
}

function updateBookingTotal(bookingData) {
    bookingData.numberOfTravelers = Math.max(1, Number(bookingData.numberOfTravelers) || 1);
    bookingData.totalPrice = bookingData.basePrice * bookingData.numberOfTravelers;
}

function openBookingConfirmationModal(bookingData) {
    pendingBookingData = bookingData;
    updateBookingTotal(pendingBookingData);

    document.getElementById('confirmDestination').textContent = bookingData.destinationName;
    const travelersInput = document.getElementById('confirmTravelersInput');
    if (travelersInput) {
        travelersInput.value = bookingData.numberOfTravelers;
    }
    document.getElementById('confirmDates').textContent = `${bookingData.startDate} - ${bookingData.endDate}`;
    document.getElementById('confirmAmount').textContent = formatCurrency(bookingData.totalPrice, bookingData.currency);

    document.getElementById('bookingConfirmationModal').style.display = 'flex';
}

function closeBookingConfirmationModal() {
    document.getElementById('bookingConfirmationModal').style.display = 'none';
}

function openReceiptModal(receiptData) {
    document.getElementById('receiptBookingId').textContent = receiptData.bookingId;
    document.getElementById('receiptDestination').textContent = receiptData.destinationName;
    document.getElementById('receiptAmount').textContent = formatCurrency(receiptData.totalPrice, receiptData.currency);
    document.getElementById('receiptDates').textContent = `${receiptData.startDate} - ${receiptData.endDate}`;
    document.getElementById('receiptTransactionId').textContent = receiptData.transactionId || 'N/A';

    document.getElementById('receiptModal').style.display = 'flex';
}

function closeReceiptModal() {
    document.getElementById('receiptModal').style.display = 'none';
    pendingBookingData = null;
}

function formatCurrency(amount, currency) {
    if (!currency || currency.toUpperCase() === 'KES') return `KES ${Number(amount).toLocaleString()}`;
    return `$${Number(amount).toLocaleString()}`;
}

// Global listeners for closing/paying
document.addEventListener('DOMContentLoaded', () => {
    const confirmBookingButton = document.getElementById('confirmBookingButton');
    if (confirmBookingButton) {
        confirmBookingButton.addEventListener('click', () => {
            if (!pendingBookingData) return;
            closeBookingConfirmationModal();
            try {
                localStorage.setItem('pendingBookingData', JSON.stringify(pendingBookingData));
                window.location.href = 'payment.html';
            } catch (e) {
                // fallback to modal if storage/navigation fails
                if (typeof mpesaPaymentHandler !== 'undefined' && typeof mpesaPaymentHandler.openPaymentModal === 'function') {
                    mpesaPaymentHandler.openPaymentModal(pendingBookingData);
                }
            }
        });
    }


    const confirmationModal = document.getElementById('bookingConfirmationModal');
    if (confirmationModal) {
        confirmationModal.addEventListener('click', (event) => {
            if (event.target === confirmationModal) {
                closeBookingConfirmationModal();
            }
        });
    }

    const travelersInput = document.getElementById('confirmTravelersInput');

    function applyTravelerCountChange(value) {
        if (!pendingBookingData) return;
        pendingBookingData.numberOfTravelers = Math.max(1, Number(value) || 1);
        updateBookingTotal(pendingBookingData);
        document.getElementById('confirmAmount').textContent = formatCurrency(pendingBookingData.totalPrice, pendingBookingData.currency);
        document.getElementById('confirmPerPerson').textContent = formatCurrency(pendingBookingData.basePrice, pendingBookingData.currency);
        if (travelersInput) travelersInput.value = pendingBookingData.numberOfTravelers;
    }

    if (travelersInput) {
        travelersInput.addEventListener('input', (event) => {
            applyTravelerCountChange(event.target.value);
        });
    }

    const receiptModal = document.getElementById('receiptModal');
    if (receiptModal) {
        receiptModal.addEventListener('click', (event) => {
            if (event.target === receiptModal) {
                closeReceiptModal();
            }
        });
    }

    const paymentTabs = document.querySelectorAll('.payment-method-tab');
    const paymentPanels = document.querySelectorAll('.payment-method-panel');

    function selectPaymentMethod(method) {
        paymentTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.method === method));
        paymentPanels.forEach(panel => panel.classList.toggle('active', panel.id === `${method}Panel`));
        if (typeof mpesaPaymentHandler !== 'undefined' && typeof mpesaPaymentHandler.setPaymentMethod === 'function') {
            mpesaPaymentHandler.setPaymentMethod(method);
        }
    }

    paymentTabs.forEach(tab => {
        tab.addEventListener('click', () => selectPaymentMethod(tab.dataset.method));
    });

    window.selectPaymentMethod = selectPaymentMethod;
    selectPaymentMethod('mpesa');
});

window.closeBookingConfirmationModal = closeBookingConfirmationModal;
window.closeReceiptModal = closeReceiptModal;
window.onMpesaPaymentSuccess = function(paymentResult) {
    mpesaPaymentHandler.closePaymentModal();
    if (!pendingBookingData) return;
    openReceiptModal({
        ...pendingBookingData,
        transactionId: paymentResult.transactionId || 'N/A'
    });
};
