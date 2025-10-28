document.addEventListener('DOMContentLoaded', () => {
    // --- Hamburger Menu Functionality ---
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navbar = document.getElementById('navbar');

    if (hamburgerMenu && navbar) {
        hamburgerMenu.addEventListener('click', function() {
            hamburgerMenu.classList.toggle('active');
            navbar.classList.toggle('active');
        });

        // Close the menu when a nav link is clicked (for smoother navigation)
        const navLinksForHamburger = navbar.querySelectorAll('.nav-link'); // Use a different variable name to avoid conflict
        navLinksForHamburger.forEach(link => {
            link.addEventListener('click', () => {
                // Check if the navbar is currently active before removing classes
                if (navbar.classList.contains('active')) {
                    hamburgerMenu.classList.remove('active');
                    navbar.classList.remove('active');
                }
            });
        });
    } else {
        console.warn("Hamburger menu or Navbar element not found. Check IDs in HTML.");
    }

    // --- Scroll to Top Button Functionality ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => { // Use addEventListener for consistency
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        });
    }


    // --- International Trips Data ---
    const internationalTrips = [
        {
            id: 1,
            image: 'booking/Paris+Trip.jpg',
            title: 'Romantic Paris Getaway',
            description: 'Experience the magic of Paris with this enchanting 5-day tour, covering iconic landmarks and hidden gems.',
            highlights: ['5 Days, 4 Nights', 'Eiffel Tower', 'Louvre Museum', 'Seine River Cruise'],
            price: 1200, // USD
            type: 'Cultural',
            duration: 5
        },
        {
            id: 2,
            image: 'booking/Maasai+Mara.jpg', 
            title: 'Tanzania Serengeti Safari', 
            description: 'An unforgettable 7-day adventure through Tanzania\'s renowned national parks, witnessing the Great Migration.',
            highlights: ['7 Days, 6 Nights', 'Serengeti National Park', 'Ngorongoro Crater', 'Wildlife Drives'],
            price: 2800, // USD
            type: 'Adventure',
            duration: 7
        },
        {
            id: 3,
            image: 'booking/Beach+Relaxation.jpg',
            title: 'Maldives Beach Retreat',
            description: 'Unwind on the pristine beaches of the Maldives. Perfect for relaxation and luxury.',
            highlights: ['6 Days, 5 Nights', 'Overwater Bungalow', 'Snorkeling', 'Spa Treatments'],
            price: 3000, // USD
            type: 'Relaxation',
            duration: 6
        },
        {
            id: 4,
            image: 'booking/Family.jpg',
            title: 'Orlando Family Fun Park',
            description: 'Exciting 8-day trip to Orlando, featuring theme parks, shows, and family-friendly attractions.',
            highlights: ['8 Days, 7 Nights', 'Disney World', 'Universal Studios', 'Kids Activities'],
            price: 1800, // USD
            type: 'Family',
            duration: 8
        },
        {
            id: 5,
            image: 'booking/Solo+Explorer.jpg',
            title: 'Iceland Solo Expedition',
            description: 'A thrilling solo journey through Iceland\'s stunning landscapes, from glaciers to hot springs.',
            highlights: ['7 Days, 6 Nights', 'Blue Lagoon', 'Golden Circle', 'Northern Lights'],
            price: 2100, // USD
            type: 'Solo',
            duration: 7
        },
        {
            id: 6,
            image: 'booking/Luxury+Cruise.jpg',
            title: 'Caribbean Luxury Cruise',
            description: 'Indulge in a luxurious 10-day cruise through the Caribbean islands, with exquisite dining and entertainment.',
            highlights: ['10 Days, 9 Nights', 'All-inclusive', 'Multiple Islands', 'Gourmet Dining'],
            price: 4500, // USD
            type: 'Luxury',
            duration: 10
        },
        {
            id: 7,
            image: 'booking/Mountain+Trek.jpg',
            title: 'Himalayan Trekking Adventure',
            description: 'Conquer the majestic Himalayas on this challenging yet rewarding trekking expedition.',
            highlights: ['12 Days, 11 Nights', 'Guided Treks', 'Stunning Vistas', 'Local Villages'],
            price: 2800, // USD
            type: 'Adventure',
            duration: 12
        },
        {
            id: 8,
            image: 'booking/Historical+Rome.jpg',
            title: 'Ancient Rome & Vatican City',
            description: 'Step back in time and explore the historical wonders of Rome and the Vatican.',
            highlights: ['4 Days, 3 Nights', 'Colosseum', 'Vatican Museums', 'Roman Forum'],
            price: 950, // USD
            type: 'Cultural',
            duration: 4
        }
    ];

    // --- Local Kenya Trips Data ---
    const localTrips = [
        {
            id: 101,
            image: 'booking/Maasai+Mara.jpg',
            title: 'Maasai Mara Safari Experience',
            description: 'Witness the Great Migration and abundant wildlife in Kenya\'s most famous reserve.',
            highlights: ['3 Days, 2 Nights', 'Game Drives', 'Maasai Village Visit', 'Full Board Accommodation'],
            price: 45000, // KES
            type: 'Safari',
            duration: 3
        },
        {
            id: 102,
            image: 'booking/Diani+Beach.jpg',
            title: 'Diani Beach Relaxation',
            description: 'Relax on the white sands of Diani Beach, enjoy water sports, and vibrant nightlife.',
            highlights: ['4 Days, 3 Nights', 'Beach Activities', 'Snorkeling & Diving', 'Resort Stay'],
            price: 35000, // KES
            type: 'Beach',
            duration: 4
        },
        {
            id: 103,
            image: 'booking/Mt+Kenya.jpg',
            title: 'Mount Kenya Trekking',
            description: 'An adventurous trek up the majestic Mount Kenya, offering stunning views and a challenging climb.',
            highlights: ['5 Days, 4 Nights', 'Guided Ascent', 'Camping', 'Breathtaking Scenery'],
            price: 60000, // KES
            type: 'Mountain',
            duration: 5
        },
        {
            id: 104,
            image: 'booking/Nairobi+City.jpg',
            title: 'Nairobi City Explorer',
            description: 'Discover the vibrant capital city with visits to national parks, cultural sites, and bustling markets.',
            highlights: ['2 Days, 1 Night', 'Nairobi National Park', 'Giraffe Centre', 'Karen Blixen Museum'],
            price: 15000, // KES
            type: 'City Escape',
            duration: 2
        },
        {
            id: 105,
            image: 'booking/Amboseli.jpg', 
            title: 'Amboseli Elephant Paradise',
            description: 'Experience incredible elephant herds with stunning views of Mount Kilimanjaro.',
            highlights: ['3 Days, 2 Nights', 'Elephant Sanctuaries', 'Kilimanjaro Views', 'Bird Watching'],
            price: 48000, // KES
            type: 'Safari',
            duration: 3
        },
        {
            id: 106,
            image: 'booking/Lake+Nakuru.jpg', 
            title: 'Lake Nakuru & Great Rift Valley',
            description: 'A scenic trip to Lake Nakuru National Park, famous for its flamingos and rhinos.',
            highlights: ['2 Days, 1 Night', 'Flamingo Spotting', 'Rhino Sanctuary', 'Rift Valley Views'],
            price: 28000, // KES
            type: 'Safari',
            duration: 2
        }
    ];

    // --- Common Elements and Variables ---
    const searchForm = document.getElementById('search-form');
    const destinationInput = document.getElementById('destination');
    const tripTypeSearchSelect = document.getElementById('trip-type');
    const checkInDateInput = document.getElementById('check-in-date');
    const checkOutDateInput = document.getElementById('check-out-date');
    const adultsInput = document.getElementById('adults');
    const childrenInput = document.getElementById('children');

    // --- International Trip Elements ---
    const internationalTripGrid = document.getElementById('international-trip-grid');
    const filterTypeCheckboxes = document.querySelectorAll('.filter-type');
    const priceRangeInput = document.getElementById('price-range');
    const priceRangeValueSpan = document.getElementById('price-range-value');
    const durationMinInput = document.getElementById('duration-min');
    const durationMaxInput = document.getElementById('duration-max');
    const sortBySelect = document.getElementById('sort-by');
    const noInternationalResultsMessage = document.getElementById('no-international-results');

    let currentFilteredInternationalTrips = [...internationalTrips]; // Initialize with all international trips

    // --- Local Trip Elements ---
    const localTripGrid = document.getElementById('local-trip-grid');
    const localFilterTypeCheckboxes = document.querySelectorAll('.local-filter-type');
    const localPriceRangeInput = document.getElementById('local-price-range');
    const localPriceRangeValueSpan = document.getElementById('local-price-range-value');
    const localDurationMinInput = document.getElementById('local-duration-min');
    const localDurationMaxInput = document.getElementById('local-duration-max');
    const localSortBySelect = document.getElementById('local-sort-by');
    const noLocalResultsMessage = document.getElementById('no-local-results');

    let currentFilteredLocalTrips = [...localTrips]; // Initialize with all local trips

    // --- Generic Render Function for both types of trips ---
    function renderTrips(tripsToRender, gridElement, noResultsElement, currencySymbol = '$') {
        gridElement.innerHTML = ''; // Clear previous trips
        if (tripsToRender.length === 0) {
            noResultsElement.style.display = 'block'; // Show no results message
            return;
        }
        noResultsElement.style.display = 'none'; // Hide no results message

        tripsToRender.forEach(trip => {
            const tripCard = document.createElement('div');
            tripCard.classList.add('trip-card');
            tripCard.innerHTML = `
                <img src="${trip.image}" alt="${trip.title}">
                <div class="trip-card-content">
                    <h3>${trip.title}</h3>
                    <p class="description">${trip.description}</p>
                    <ul class="highlights">
                        ${trip.highlights.map(highlight => `<li><i class="fas fa-check-circle"></i> ${highlight}</li>`).join('')}
                        <li><i class="fas fa-tag"></i> Trip Type: ${trip.type}</li>
                    </ul>
                    <p class="price">Starting from ${currencySymbol}${trip.price.toLocaleString()}</p>
                    <button class="btn btn-primary">View Details</button>
                </div>
            `;
            gridElement.appendChild(tripCard);
        });
    }

    // --- Search Form Submission (Affects International Trips by default) ---
    if (searchForm) { // Added null check for searchForm
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const destination = destinationInput.value.toLowerCase().trim();
            const tripType = tripTypeSearchSelect.value;
            const checkInDate = checkInDateInput.value;
            const checkOutDate = checkOutDateInput.value;
            const adults = parseInt(adultsInput.value);
            const children = parseInt(childrenInput.value);

            // Basic form validation
            if (!destination && !tripType) {
                alert('Please enter a destination or select a trip type.');
                return;
            }
            if (checkInDate && checkOutDate && new Date(checkInDate) > new Date(checkOutDate)) {
                alert('Check-out date cannot be before check-in date.');
                return;
            }
            if (adults < 1) {
                alert('At least one adult is required.');
                return;
            }

            // Filter international trips based on search bar
            let results = internationalTrips.filter(trip => {
                const matchesDestination = destination ? trip.title.toLowerCase().includes(destination) || trip.description.toLowerCase().includes(destination) : true;
                const matchesTripType = tripType ? trip.type === tripType : true;
                return matchesDestination && matchesTripType;
            });

            currentFilteredInternationalTrips = results; // Update the current filtered list
            applyInternationalFiltersAndSort(); // Apply additional filters and sort
        });
    }

    // --- International Trip Filtering and Sorting Logic ---
    function applyInternationalFiltersAndSort() {
        let filtered = [...currentFilteredInternationalTrips]; // Start with search results

        // Filter by selected trip types checkboxes
        const selectedTripTypes = Array.from(filterTypeCheckboxes)
                                        .filter(checkbox => checkbox.checked)
                                        .map(checkbox => checkbox.value);
        if (selectedTripTypes.length > 0) {
            filtered = filtered.filter(trip => selectedTripTypes.includes(trip.type));
        }

        // Filter by price range
        const maxPrice = parseInt(priceRangeInput.value);
        filtered = filtered.filter(trip => trip.price <= maxPrice);

        // Filter by duration
        const minDuration = parseInt(durationMinInput.value);
        const maxDuration = parseInt(durationMaxInput.value);
        if (!isNaN(minDuration)) {
            filtered = filtered.filter(trip => trip.duration >= minDuration);
        }
        if (!isNaN(maxDuration)) {
            filtered = filtered.filter(trip => trip.duration <= maxDuration);
        }

        // Sort the filtered trips
        const sortBy = sortBySelect.value;
        if (sortBy === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'popularity') {
            filtered.sort((a, b) => a.id - b.id); // Simple sort by ID for 'popularity'
        }

        if (internationalTripGrid && noInternationalResultsMessage) { // Added null checks
            renderTrips(filtered, internationalTripGrid, noInternationalResultsMessage, '$');
        }
    }

    // Event Listeners for International Trip Filters/Sort
    filterTypeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyInternationalFiltersAndSort);
    });

    if (priceRangeInput && priceRangeValueSpan) { // Added null checks
        priceRangeInput.addEventListener('input', () => {
            priceRangeValueSpan.textContent = `Up to $${parseInt(priceRangeInput.value).toLocaleString()}`;
            applyInternationalFiltersAndSort();
        });
    }

    if (durationMinInput) durationMinInput.addEventListener('input', applyInternationalFiltersAndSort);
    if (durationMaxInput) durationMaxInput.addEventListener('input', applyInternationalFiltersAndSort);
    if (sortBySelect) sortBySelect.addEventListener('change', applyInternationalFiltersAndSort);


    // --- Local Kenya Trip Filtering and Sorting Logic ---
    function applyLocalFiltersAndSort() {
        let filtered = [...localTrips]; // Always start with all local trips for its dedicated filters

        // Filter by selected Kenya trip types checkboxes
        const selectedTripTypes = Array.from(localFilterTypeCheckboxes)
                                        .filter(checkbox => checkbox.checked)
                                        .map(checkbox => checkbox.value);
        if (selectedTripTypes.length > 0) {
            filtered = filtered.filter(trip => selectedTripTypes.includes(trip.type));
        }

        // Filter by local price range (KES)
        const maxPrice = parseInt(localPriceRangeInput.value);
        filtered = filtered.filter(trip => trip.price <= maxPrice);

        // Filter by duration
        const minDuration = parseInt(localDurationMinInput.value);
        const maxDuration = parseInt(localDurationMaxInput.value);
        if (!isNaN(minDuration)) {
            filtered = filtered.filter(trip => trip.duration >= minDuration);
        }
        if (!isNaN(maxDuration)) {
            filtered = filtered.filter(trip => trip.duration <= maxDuration);
        }

        // Sort the filtered trips
        const sortBy = localSortBySelect.value;
        if (sortBy === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'popularity') {
            filtered.sort((a, b) => a.id - b.id);
        }

        if (localTripGrid && noLocalResultsMessage) { // Added null checks
            renderTrips(filtered, localTripGrid, noLocalResultsMessage, 'KES '); // Use KES for local trips
        }
    }

    // Event Listeners for Local Trip Filters/Sort
    localFilterTypeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyLocalFiltersAndSort);
    });

    if (localPriceRangeInput && localPriceRangeValueSpan) { // Added null checks
        localPriceRangeInput.addEventListener('input', () => {
            localPriceRangeValueSpan.textContent = `Up to KES ${parseInt(localPriceRangeInput.value).toLocaleString()}`;
            applyLocalFiltersAndSort();
        });
    }

    if (localDurationMinInput) localDurationMinInput.addEventListener('input', applyLocalFiltersAndSort);
    if (localDurationMaxInput) localDurationMaxInput.addEventListener('input', applyLocalFiltersAndSort);
    if (localSortBySelect) localSortBySelect.addEventListener('change', applyLocalFiltersAndSort);


    // --- Navigation Active State Handling ---
    // Handle initial active nav link based on current URL hash (if any)
    const currentHash = window.location.hash;
    const navLinks = document.querySelectorAll('.nav-link'); // Note: This is different from navLinksForHamburger

    // Function to set active link
    function setActiveLink() {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        if (currentHash) {
            const activeLink = document.querySelector(`.nav-link[href$="${currentHash}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        } else {
            // Default to 'International Destinations' if no hash in URL
            const defaultLink = document.querySelector('.nav-link[href="#international-destinations"]');
            if (defaultLink) {
                defaultLink.classList.add('active');
            }
        }
    }

    // Update active nav link on click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // --- Initial Render Calls and Setup ---
    // Render both international and local trips when the page loads
    if (internationalTripGrid && noInternationalResultsMessage) {
        renderTrips(internationalTrips, internationalTripGrid, noInternationalResultsMessage, '$');
    }
    if (localTripGrid && noLocalResultsMessage) {
        renderTrips(localTrips, localTripGrid, noLocalResultsMessage, 'KES ');
    }

    // Set the initial active navigation link
    setActiveLink();
});

  document.addEventListener('DOMContentLoaded', function() {
      const bookingForm = document.querySelector('.booking-form');
        const bookingPrompt = document.querySelector('.booking-prompt');
        const bookingContainer = document.querySelector('.container');

        bookingForm.addEventListener('submit', function(event) {
         event.preventDefault();
        bookingPrompt.style.display = 'none';
        bookingContainer.style.display = 'block';
        });
            });