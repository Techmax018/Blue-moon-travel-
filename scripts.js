document.addEventListener('DOMContentLoaded', () => {
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.carousel-dots .dot, .dot');
    let currentIndex = 0;
    const intervalTime = 5000;
    let autoSwipeInterval;

    function showTestimonial(index) {
        testimonialItems.forEach((item, itemIndex) => {
            item.classList.toggle('active', itemIndex === index);
            item.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.toggle('is-visible', itemIndex === index));
        });
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === index);
        });
    }

    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonialItems.length;
        showTestimonial(currentIndex);
    }

    if (testimonialItems.length && dots.length) {
        showTestimonial(currentIndex);
        autoSwipeInterval = setInterval(nextTestimonial, intervalTime);

        const carouselContainer = document.querySelector('.testimonials-carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => clearInterval(autoSwipeInterval));
            carouselContainer.addEventListener('mouseleave', () => autoSwipeInterval = setInterval(nextTestimonial, intervalTime));
        }

        dots.forEach(dot => {
            dot.addEventListener('click', (event) => {
                const slideIndex = parseInt(event.target.dataset.slide, 10);
                if (!Number.isNaN(slideIndex)) {
                    currentIndex = slideIndex;
                    showTestimonial(currentIndex);
                    clearInterval(autoSwipeInterval);
                    autoSwipeInterval = setInterval(nextTestimonial, intervalTime);
                }
            });
        });
    }

    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburgerMenu && navbar) {
        hamburgerMenu.addEventListener('click', () => {
            navbar.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar?.classList.contains('active')) {
                navbar.classList.remove('active');
                hamburgerMenu?.classList.remove('active');
            }
        });
    });

    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const scrollThreshold = 200;

    function updateScrollButton() {
        if (!scrollToTopBtn) return;
        scrollToTopBtn.style.display = (window.scrollY > scrollThreshold) ? 'block' : 'none';
    }

    if (scrollToTopBtn) {
        window.addEventListener('scroll', updateScrollButton);
        scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        updateScrollButton();
    }

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observerRef) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observerRef.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });

        animateElements.forEach(element => observer.observe(element));
    } else {
        animateElements.forEach(element => element.classList.add('is-visible'));
    }
});