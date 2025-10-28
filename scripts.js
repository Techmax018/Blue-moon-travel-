document.addEventListener('DOMContentLoaded', () => {
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    const intervalTime = 5000;

    function showTestimonial(index) {
        testimonialItems.forEach(item => {
            item.classList.remove('active');
            item.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.remove('is-visible'));
        });
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        if (testimonialItems[index]) {
            testimonialItems[index].classList.add('active');
            dots[index].classList.add('active');
            testimonialItems[index].querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('is-visible'));
        }
    }

    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonialItems.length;
        showTestimonial(currentIndex);
    }

    showTestimonial(currentIndex);

    let autoSwipeInterval = setInterval(nextTestimonial, intervalTime);

    const carouselContainer = document.querySelector('.testimonials-carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSwipeInterval);
        });
        carouselContainer.addEventListener('mouseleave', () => {
            autoSwipeInterval = setInterval(nextTestimonial, intervalTime);
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (event) => {
            const slideIndex = parseInt(event.target.dataset.slide);
            currentIndex = slideIndex;
            showTestimonial(currentIndex);
            clearInterval(autoSwipeInterval);
            autoSwipeInterval = setInterval(nextTestimonial, intervalTime);
        });
    });

    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    window.addEventListener('scroll', () => {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(element => {
        observer.observe(element);
    });
});document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link'); // Select all nav links

    // Toggle menu visibility and hamburger icon animation
    hamburgerMenu.addEventListener('click', () => {
        navbar.classList.toggle('active');
        hamburgerMenu.classList.toggle('active'); // Animate hamburger icon
    });

    // Close menu when a nav link is clicked (for smooth scrolling)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            hamburgerMenu.classList.remove('active'); // Reset hamburger icon
        });
    });

    // --- Existing Testimonials Carousel (ensure this is present if you have it) ---
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(index) {
        testimonialItems.forEach((item, i) => {
            item.classList.remove('active');
            dots[i].classList.remove('active');
        });
        testimonialItems[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonialItems.length;
        showSlide(currentSlide);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (event) => {
            stopAutoSlide();
            const slideIndex = parseInt(event.target.dataset.slide);
            showSlide(slideIndex);
            startAutoSlide(); // Restart auto-slide after manual selection
        });
    });

    showSlide(currentSlide);
    startAutoSlide(); // Start carousel on load

    // --- Existing Scroll to Top Button (ensure this is present if you have it) ---
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    window.onscroll = function() {
        scrollFunction();
    };

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    }

    scrollToTopBtn.addEventListener("click", () => {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });

});