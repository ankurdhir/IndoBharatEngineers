// Modern Website JavaScript - Carousel, Animations, Dark Mode
// Indo Bharat Engineers Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initCarousel();
    initScrollAnimations();
    initDarkMode();
    initSmoothScrolling();
    initInteractiveElements();
    initContactForm();
    
    // Add loading animation
    document.body.classList.add('loading');
});

// ===============================
// CAROUSEL FUNCTIONALITY
// ===============================
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevButton = carousel.querySelector('.carousel-prev');
    const nextButton = carousel.querySelector('.carousel-next');
    
    if (!track || !slides.length) return;
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoplayInterval;
    
    // Clone first and last slides for infinite loop effect
    const firstSlideClone = slides[0].cloneNode(true);
    const lastSlideClone = slides[totalSlides - 1].cloneNode(true);
    
    track.appendChild(firstSlideClone);
    track.insertBefore(lastSlideClone, slides[0]);
    
    const allSlides = track.querySelectorAll('.carousel-slide');
    const slideWidth = 100; // percentage
    
    // Set initial position
    track.style.transform = `translateX(-${slideWidth}%)`;
    currentIndex = 1;
    
    // Move to specific slide
    function moveToSlide(index, smooth = true) {
        if (!smooth) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
        
        track.style.transform = `translateX(-${index * slideWidth}%)`;
        currentIndex = index;
        
        // Handle infinite loop
        if (!smooth) {
            setTimeout(() => {
                track.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }, 50);
        }
    }
    
    // Next slide
    function nextSlide() {
        if (currentIndex >= totalSlides + 1) {
            moveToSlide(currentIndex + 1);
            setTimeout(() => {
                moveToSlide(1, false);
            }, 800);
        } else {
            moveToSlide(currentIndex + 1);
        }
    }
    
    // Previous slide
    function prevSlide() {
        if (currentIndex <= 0) {
            moveToSlide(currentIndex - 1);
            setTimeout(() => {
                moveToSlide(totalSlides, false);
            }, 800);
        } else {
            moveToSlide(currentIndex - 1);
        }
    }
    
    // Auto-play functionality
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 4000); // 4 seconds
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Event listeners for manual controls
    if (nextButton) {
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Force button to stay in correct position
            nextButton.style.position = 'absolute';
            nextButton.style.right = '16px';
            nextButton.style.top = '50%';
            nextButton.style.transform = 'translateY(-50%)';
            nextButton.style.zIndex = '10';
            
            stopAutoplay();
            nextSlide();
            
            // Double-check position after animation
            setTimeout(() => {
                nextButton.style.right = '16px';
                nextButton.style.top = '50%';
                nextButton.style.transform = 'translateY(-50%)';
            }, 100);
            
            setTimeout(startAutoplay, 8000); // Restart autoplay after 8 seconds
        });
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Force button to stay in correct position
            prevButton.style.position = 'absolute';
            prevButton.style.left = '16px';
            prevButton.style.top = '50%';
            prevButton.style.transform = 'translateY(-50%)';
            prevButton.style.zIndex = '10';
            
            stopAutoplay();
            prevSlide();
            
            // Double-check position after animation
            setTimeout(() => {
                prevButton.style.left = '16px';
                prevButton.style.top = '50%';
                prevButton.style.transform = 'translateY(-50%)';
            }, 100);
            
            setTimeout(startAutoplay, 8000); // Restart autoplay after 8 seconds
        });
    }
    
    // Pause autoplay on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    
    // Touch/swipe support for mobile
    let startX = 0;
    let isDragging = false;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoplay();
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    carousel.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        setTimeout(startAutoplay, 8000);
    });
    
    // Start autoplay
    startAutoplay();
    
    // Add smooth entrance animation
    setTimeout(() => {
        carousel.style.opacity = '1';
        carousel.style.transform = 'translateY(0)';
    }, 200);
}

// ===============================
// SCROLL ANIMATIONS
// ===============================
function initScrollAnimations() {
    // Create intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add visible class for CSS animations
                element.classList.remove('scroll-hidden');
                element.classList.add('scroll-visible');
                
                // Add stagger effect for children
                const children = element.querySelectorAll('.animate-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-fade-in');
                    }, index * 100);
                });
                
                // Stop observing once animated
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe all elements that should animate on scroll
    const animateElements = document.querySelectorAll([
        '.scroll-animate',
        'section',
        '.service-card',
        '.hover-card',
        'h1', 'h2', 'h3',
        '.professional-image'
    ].join(', '));
    
    animateElements.forEach(element => {
        element.classList.add('scroll-hidden');
        observer.observe(element);
    });
    
    // Add parallax effect to hero section
    const hero = document.querySelector('#hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        });
    }
}

// ===============================
// DARK MODE FUNCTIONALITY
// ===============================
function initDarkMode() {
    const toggleButton = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    if (!toggleButton) return;
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the saved theme
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
        updateThemeIcon(true);
    }
    
    // Toggle theme
    toggleButton.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
        
        // Add smooth transition effect
        document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);
    });
    
    function updateThemeIcon(isDark) {
        if (!themeIcon) return;
        
        if (isDark) {
            // Sun icon for dark mode
            themeIcon.innerHTML = `
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            `;
        } else {
            // Moon icon for light mode
            themeIcon.innerHTML = `
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            `;
        }
    }
}

// ===============================
// SMOOTH SCROLLING
// ===============================
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80; // Account for fixed header
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add scroll progress indicator
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    scrollProgress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(scrollProgress);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
    });
}

// ===============================
// INTERACTIVE ELEMENTS
// ===============================
function initInteractiveElements() {
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('.interactive, .hover-card, .service-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-primary, button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                background-color: rgba(255, 255, 255, 0.7);
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===============================
// UTILITY FUNCTIONS
// ===============================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add performance optimizations
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            // Any scroll-based animations can be optimized here
            ticking = false;
        });
        ticking = true;
    }
});

// Add loading animation removal
window.addEventListener('load', () => {
    document.body.classList.remove('loading');
    
    // Add entrance animations with stagger
    const elementsToAnimate = document.querySelectorAll('header, .carousel, section');
    elementsToAnimate.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Add mobile optimizations
if (window.innerWidth <= 768) {
    // Disable some heavy animations on mobile for better performance
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
} else {
    document.documentElement.style.setProperty('--animation-duration', '0.8s');
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    
    if (e.key === 'ArrowLeft') {
        const prevButton = carousel.querySelector('.carousel-prev');
        if (prevButton) prevButton.click();
    } else if (e.key === 'ArrowRight') {
        const nextButton = carousel.querySelector('.carousel-next');
        if (nextButton) nextButton.click();
    }
});

// ===============================
// CONTACT FORM FUNCTIONALITY
// ===============================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            service: formData.get('service'),
            message: formData.get('message')
        };
        
        // Validate required fields
        if (!data.name || !data.phone || !data.email || !data.message) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Create WhatsApp message
        const whatsappMessage = `*New Inquiry - Indo Bharat Engineers*
        
*Name:* ${data.name}
*Phone:* ${data.phone}
*Email:* ${data.email}
*Service:* ${data.service || 'Not specified'}

*Message:*
${data.message}`;
        
        // Send to WhatsApp
        const whatsappUrl = `https://wa.me/918700628217?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Also send email (you can integrate with EmailJS or similar service)
        sendEmailNotification(data);
        
        // Show success message
        if (formSuccess) {
            formSuccess.classList.remove('hidden');
            contactForm.reset();
            
            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Open WhatsApp after 2 seconds
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 2000);
        }
    });
}

// Email notification function (you can integrate with EmailJS, Formspree, etc.)
function sendEmailNotification(data) {
    // For now, we'll create a mailto link as backup
    const subject = 'New Inquiry from Website - Indo Bharat Engineers';
    const body = `Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
Service: ${data.service || 'Not specified'}

Message:
${data.message}`;
    
    const mailtoUrl = `mailto:emegampere@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // You can replace this with actual email service integration
    console.log('Email would be sent to:', mailtoUrl);
}

// Error handling
window.addEventListener('error', function(e) {
    console.warn('Non-critical error:', e.error);
});

// Ensure all images are properly loaded
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    
    images.forEach(img => {
        if (img.complete) {
            loadedImages++;
        } else {
            img.addEventListener('load', () => {
                loadedImages++;
                if (loadedImages === images.length) {
                    // All images loaded - can trigger any final animations
                    document.body.classList.add('images-loaded');
                }
            });
        }
    });
    
    if (loadedImages === images.length) {
        document.body.classList.add('images-loaded');
    }
});