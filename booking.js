const mpesaPaymentHandler = {
    openPaymentModal(bookingData) {
        const mpesaModal = document.getElementById('mpesaPaymentModal');
        if (!mpesaModal) return;

        // Populate the summary fields in your M-Pesa modal
        document.getElementById('mpesaSummaryDestination').textContent = bookingData.destinationName;
        document.getElementById('mpesaSummaryTravelers').textContent = bookingData.numberOfTravelers + " Traveler(s)";
        document.getElementById('mpesaSummaryDate').textContent = bookingData.startDate;
        
        const priceString = `${bookingData.currency} ${bookingData.totalPrice.toLocaleString()}`;
        document.getElementById('mpesaSummaryAmount').textContent = priceString;
        document.getElementById('btnAmount').textContent = priceString;

        // Reset state
        document.getElementById('mpesaLoaderOverlay').style.display = 'none';
        document.getElementById('mpesaMainContent').style.display = 'block';
        mpesaModal.style.display = 'flex';
    },

    closePaymentModal() {
        const mpesaModal = document.getElementById('mpesaPaymentModal');
        if (mpesaModal) mpesaModal.style.display = 'none';
    },

    handleSTKPush(e) {
        e.preventDefault();
        // Show the loading state (waiting for user to enter PIN)
        document.getElementById('mpesaMainContent').style.display = 'none';
        document.getElementById('mpesaLoaderOverlay').style.display = 'flex';

        const phone = document.getElementById('mpesaPhoneNumber').value;
        console.log("Initiating STK Push for: ", phone);
        
        // Integration point: Call your backend API here
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // --- M-Pesa Form Listener ---
    const mpesaForm = document.getElementById('mpesaPaymentForm');
    if (mpesaForm) {
        mpesaForm.addEventListener('submit', mpesaPaymentHandler.handleSTKPush);
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
    const internationalTrips = [ /* ... your international trip objects ... */ ];
    const localTrips = [ /* ... your local trip objects ... */ ];

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
            tripCard.querySelector('.view-details-btn').addEventListener('click', () => openTripDetailsModal(trip, currencySymbol));
        });
    }

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
let currentTripData = null;
let currencySymbolForPayment = '$';

function openTripDetailsModal(trip, currencySymbol) {
    currentTripData = trip;
    currencySymbolForPayment = currencySymbol;

    document.getElementById('modalTripImage').src = trip.image;
    document.getElementById('modalTripTitle').textContent = trip.title;
    document.getElementById('modalTripDescription').textContent = trip.description;
    document.getElementById('modalTripPrice').textContent = `${currencySymbol}${trip.price.toLocaleString()}`;

    document.getElementById('tripDetailsModal').style.display = 'block';
}

function closeTripDetailsModal() {
    document.getElementById('tripDetailsModal').style.display = 'none';
    currentTripData = null;
}

// Global listeners for closing/paying
document.addEventListener('DOMContentLoaded', () => {
    const payButton = document.getElementById('modalPayButton');
    if (payButton) {
        payButton.addEventListener('click', () => {
            if (currentTripData) {
                const bookingData = {
                    destinationName: currentTripData.title,
                    totalPrice: currentTripData.price,
                    currency: currencySymbolForPayment.trim(), // Remove extra spaces
                    numberOfTravelers: 1,
                    startDate: new Date().toLocaleDateString()
                };

                closeTripDetailsModal();
                mpesaPaymentHandler.openPaymentModal(bookingData);
            }
        });
    }
});
