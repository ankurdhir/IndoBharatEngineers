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
    initMobileMenu();
    
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
    let isAnimating = false; // prevent rapid clicks
    
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
        if (isAnimating) return; // guard
        isAnimating = true;
        if (!smooth) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
        
        track.style.transform = `translate3d(-${index * slideWidth}%, 0, 0)`; // GPU accel to reduce flicker
        currentIndex = index;
        
        // Handle infinite loop
        if (!smooth) {
            setTimeout(() => {
                track.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                isAnimating = false;
            }, 50);
        }
        // Unlock after transition ends
        setTimeout(() => { isAnimating = false; }, 820);
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
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => { if (!isAnimating) nextSlide(); }, 5000); // slower 5s
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
            if (!isAnimating) nextSlide();
            
            // Double-check position after animation
            setTimeout(() => {
                nextButton.style.right = '16px';
                nextButton.style.top = '50%';
                nextButton.style.transform = 'translateY(-50%)';
            }, 100);
            
            setTimeout(startAutoplay, 6000); // Restart autoplay after 6 seconds
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
            if (!isAnimating) prevSlide();
            
            // Double-check position after animation
            setTimeout(() => {
                prevButton.style.left = '16px';
                prevButton.style.top = '50%';
                prevButton.style.transform = 'translateY(-50%)';
            }, 100);
            
            setTimeout(startAutoplay, 6000); // Restart autoplay after 6 seconds
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
    
    // Check for saved theme preference or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply the saved theme
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
        updateThemeIcon(true);
    } else {
        // Default to dark on first load
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
    
    contactForm.addEventListener('submit', async function(e) {
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
        
        try {
            // Show sending state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Send email notification
            const emailResult = await sendEmailNotification(data);
            
            // Show success message
            if (formSuccess) {
                formSuccess.classList.remove('hidden');
                contactForm.reset();
                
                // Update success message based on email method
                if (emailResult.method === 'emailjs') {
                    formSuccess.innerHTML = '<div class="flex items-center"><svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg><p>✅ Email sent successfully! We will contact you soon via email and WhatsApp.</p></div>';
                } else {
                    formSuccess.innerHTML = '<div class="flex items-center"><svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg><p>✅ Message prepared! We will contact you via WhatsApp.</p></div>';
                }
                
                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Open WhatsApp after 2 seconds
                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                }, 2000);
            }
            
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            
        } catch (error) {
            console.error('Error sending message:', error);
            console.error('Error details:', error.message, error.status, error.text);
            console.error('Form data:', data);
            console.error('EmailJS configured:', typeof emailjs !== 'undefined');
            alert('❌ EmailJS error. Opening email client as backup...');
            
            // Fallback to mailto
            const subject = `New Inquiry from Website - ${data.name}`;
            const body = `Name: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nService: ${data.service || 'Not specified'}\n\nMessage:\n${data.message}`;
            const mailtoUrl = `mailto:support@indobharatengineers.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(mailtoUrl, '_blank');
            
            // Still show success for WhatsApp
            if (formSuccess) {
                formSuccess.classList.remove('hidden');
                contactForm.reset();
                formSuccess.innerHTML = '<div class="flex items-center"><svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg><p>✅ Message prepared! We will contact you via WhatsApp and email.</p></div>';
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                }, 2000);
            }
        }
    });
}

// Email notification function (integrated with EmailJS)
async function sendEmailNotification(data) {
    // For now, we'll create a mailto link as backup
    const subject = 'New Inquiry from Website - Indo Bharat Engineers';
    const body = `Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
Service: ${data.service || 'Not specified'}

Message:
${data.message}`;
    
    // Try to send email via EmailJS (if configured)
    if (typeof emailjs !== 'undefined') {
        try {
            const templateParams = {
                from_name: data.name,
                from_email: data.email,
                phone: data.phone,
                service: data.service || 'Not specified',
                message: data.message,
                subject: subject
            };
            
            // Your EmailJS configuration
            await emailjs.send('service_agc507u', 'template_glpahn5', templateParams, '-zkL1u2llqlU54F8X');
            
            console.log('Email sent successfully via EmailJS');
            return { success: true, method: 'emailjs' };
        } catch (error) {
            console.warn('EmailJS failed, falling back to mailto:', error);
            console.warn('Error details:', error.message, error.status, error.text);
            console.warn('Template params sent:', templateParams);
            // Fallback to mailto if EmailJS fails
            const mailtoUrl = `mailto:support@indobharatengineers.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(mailtoUrl, '_blank');
            return { success: true, method: 'mailto' };
        }
    } else {
        // Fallback to mailto if EmailJS is not loaded
        const mailtoUrl = `mailto:support@indobharatengineers.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoUrl, '_blank');
        return { success: true, method: 'mailto' };
    }
}

// ===============================
// MOBILE MENU FUNCTIONALITY
// ===============================
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');
    
    if (!mobileMenuButton || !mobileMenu) return;
    
    // Toggle mobile menu
    mobileMenuButton.addEventListener('click', function() {
        const isOpen = !mobileMenu.classList.contains('hidden');
        
        if (isOpen) {
            // Close menu
            mobileMenu.classList.add('hidden');
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        } else {
            // Open menu
            mobileMenu.classList.remove('hidden');
            hamburgerIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
        }
    });
    
    // Close menu when clicking on a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
            mobileMenu.classList.add('hidden');
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
    });
    
    // Handle mobile theme toggle
    const mobileThemeToggle = document.getElementById('theme-toggle-mobile');
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', function() {
            // Use the same dark mode toggle functionality
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcons();
            
            // Add smooth transition effect
            document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            setTimeout(() => {
                document.documentElement.style.transition = '';
            }, 300);
        });
    }
}

function updateThemeIcons() {
    const themeIcon = document.getElementById('theme-icon');
    const isDark = document.documentElement.classList.contains('dark');
    
    if (themeIcon) {
        if (isDark) {
            themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"></path>';
        } else {
            themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        }
    }
}

// Update the existing updateThemeIcon function to use the new one
function updateThemeIcon(isDark) {
    updateThemeIcons();
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