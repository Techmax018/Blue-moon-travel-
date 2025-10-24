document.addEventListener('DOMContentLoaded', () => {
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dotsContainer = document.querySelector('.carousel-dots');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    const intervalTime = 5000; 

    function showTestimonial(index) {
        
        testimonialItems.forEach(item => {
            item.classList.remove('active');
        });
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        
        if (testimonialItems[index]) { 
            testimonialItems[index].classList.add('active');
            dots[index].classList.add('active');
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
});