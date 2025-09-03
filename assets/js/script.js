// Modern Website JavaScript - Carousel, Animations, Dark Mode
// Indo Bharat Engineers Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initCarousel();
    initSwiperCarousel();
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
    const prevButton = carousel.querySelector('.carousel-prev');
    const nextButton = carousel.querySelector('.carousel-next');
    const indicatorsWrap = carousel.querySelector('.carousel-indicators');
    const autoplayEnabled = carousel.dataset.autoplay === 'true';

    // Build slides from template (keeps markup DRY and easier to maintain)
    const template = document.getElementById('carousel-slides-template');
    if (!template) return;
    track.innerHTML = ''; // ensure empty
    // append all slides from template's children
    Array.from(template.content.children).forEach(node => track.appendChild(node.cloneNode(true)));

    let slides = Array.from(track.children);
    const totalSlides = slides.length;
    if (totalSlides === 0) return;

    // Clone first & last for infinite loop
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    track.appendChild(firstClone);
    track.insertBefore(lastClone, track.firstChild);

    // re-collect slides (with clones)
    const allSlides = Array.from(track.children);
    // ensure each slide is width: 100% via Tailwind classes already applied (w-full)
    // initial index points to the first real slide (index 1 because of prepended clone)
    let currentIndex = 1;
    let isAnimating = false;
    let autoplayInterval = null;

    // Apply initial transform
    // Use percent relative to track width; each slide is 100 / allSlides.length of track
    const stepPercent = 100 / allSlides.length;
    const setTranslate = (idx, withTransition = true) => {
      if (!withTransition) {
        track.style.transition = 'none';
      } else {
        track.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      }
      track.style.transform = `translate3d(-${idx * stepPercent}%, 0, 0)`;
    };

    // Setup track CSS for smoothness
    track.style.display = 'flex';
    track.style.width = `${allSlides.length * 100}%`;
    allSlides.forEach(slide => slide.style.width = `${100 / allSlides.length}%`);

    // Initial place
    setTranslate(currentIndex, false);
    // small entrance
    requestAnimationFrame(() => {
      carousel.style.opacity = '1';
      carousel.style.transform = 'translateY(0)';
    });

    // Build indicators for real slides only
    indicatorsWrap.innerHTML = '';
    const createIndicator = (i) => {
      const btn = document.createElement('button');
      btn.className = 'w-3 h-3 rounded-full bg-white/40 hover:bg-white/70 transition';
      btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
      btn.type = 'button';
      btn.addEventListener('click', () => {
        goToRealSlide(i);
        restartAutoplay(6000);
      });
      indicatorsWrap.appendChild(btn);
      return btn;
    };
    const indicators = [];
    for (let i = 0; i < totalSlides; i++) {
      indicators.push(createIndicator(i));
    }
    const updateIndicators = () => {
      const realIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      indicators.forEach((dot, i) => {
        dot.classList.toggle('bg-white', i === realIndex);
        dot.classList.toggle('bg-white/40', i !== realIndex);
      });
    };
    updateIndicators();

    // transitionend handler (cleanly handle clone jumps)
    track.addEventListener('transitionend', (ev) => {
      // ensure event belongs to transform on track (some browsers may fire multiple)
      if (ev.target !== track || ev.propertyName !== 'transform') return;

      // If we're on the clone slides (either 0 or last index), jump to real slide without animation
      if (currentIndex === 0) {
        // jumped to the (clone of last) => jump to real last
        track.style.transition = 'none';
        currentIndex = totalSlides;
        track.style.transform = `translate3d(-${currentIndex * stepPercent}%, 0, 0)`;
      } else if (currentIndex === totalSlides + 1) {
        // jumped to (clone of first) => jump to real first
        track.style.transition = 'none';
        currentIndex = 1;
        track.style.transform = `translate3d(-${currentIndex * stepPercent}%, 0, 0)`;
      }
      // re-enable transitions for next move (via small reflow)
      requestAnimationFrame(() => {
        track.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });

      isAnimating = false;
      updateIndicators();
    });

    // Core navigation
    function moveTo(index) {
      if (isAnimating) return;
      isAnimating = true;
      currentIndex = index;
      setTranslate(currentIndex, true);
    }
    function next() { moveTo(currentIndex + 1); }
    function prev() { moveTo(currentIndex - 1); }
    function goToRealSlide(realIndexZeroBased) {
      // real index 0..totalSlides-1 maps to internal index realIndex+1
      moveTo(realIndexZeroBased + 1);
    }

    // Controls
    if (nextButton) nextButton.addEventListener('click', (e) => { e.preventDefault(); stopAutoplay(); next(); restartAutoplay(6000); });
    if (prevButton) prevButton.addEventListener('click', (e) => { e.preventDefault(); stopAutoplay(); prev(); restartAutoplay(6000); });

    // Keyboard navigation (when carousel is focused)
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); stopAutoplay(); next(); restartAutoplay(6000); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); stopAutoplay(); prev(); restartAutoplay(6000); }
    });

    // Pointer drag (mouse + touch using pointer events)
    let pointerStartX = 0;
    let pointerDeltaX = 0;
    let dragging = false;

    const onPointerDown = (ev) => {
      if (ev.pointerType === 'mouse' && ev.button !== 0) return; // only left-click
      dragging = true;
      pointerStartX = ev.clientX;
      pointerDeltaX = 0;
      track.style.transition = 'none';
      carousel.setPointerCapture?.(ev.pointerId);
      stopAutoplay();
    };
    const onPointerMove = (ev) => {
      if (!dragging) return;
      pointerDeltaX = ev.clientX - pointerStartX;
      // compute percentage shift relative to track width
      // shifting by pointerDeltaX px equals (pointerDeltaX / trackWidth) * 100%
      // trackWidth = allSlides.length * carousel.clientWidth
      const pctSlide = (pointerDeltaX / carousel.clientWidth) * stepPercent;
      track.style.transform = `translate3d(-${currentIndex * stepPercent - pctSlide}%, 0, 0)`;
    };
    const onPointerUp = (ev) => {
      if (!dragging) return;
      dragging = false;
      const thresholdPx = Math.max(50, carousel.clientWidth * 0.08); // 8% or 50px min
      if (Math.abs(pointerDeltaX) > thresholdPx) {
        if (pointerDeltaX < 0) {
          // swiped left -> next
          next();
        } else {
          // swiped right -> prev
          prev();
        }
      } else {
        // small move -> snap back
        setTranslate(currentIndex, true);
        // re-enable default transition after a frame (transitionend will set flags)
      }
      startAutoplayDelayed(8000);
    };

    carousel.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // Autoplay & visibility/focus handling
    function startAutoplay() {
      if (!autoplayEnabled) return;
      stopAutoplay();
      autoplayInterval = setInterval(() => {
        if (!isAnimating && document.visibilityState === 'visible') next();
      }, 5000);
    }
    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }
    function restartAutoplay(delay = 0) {
      stopAutoplay();
      if (!autoplayEnabled) return;
      if (delay <= 0) startAutoplay();
      else setTimeout(startAutoplay, delay);
    }
    function startAutoplayDelayed(ms) {
      stopAutoplay();
      setTimeout(startAutoplay, ms);
    }

    // Pause autoplay on hover, focus, or when page hidden
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') stopAutoplay();
      else startAutoplay();
    });

    // Start autoplay initially if enabled
    startAutoplay();

    // Recalculate sizes on resize (keeps percent math consistent)
    window.addEventListener('resize', () => {
      // small reflow adjustments: restore current transform based on currentIndex
      setTranslate(currentIndex, false);
    });

    // Expose a cleanup method (optional)
    carousel._destroyCarousel = () => {
      stopAutoplay();
      carousel.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }

// ===============================
// SWIPER CAROUSEL (out-of-box)
// ===============================
function initSwiperCarousel() {
  if (typeof Swiper === 'undefined') return;
  const swiperEl = document.querySelector('.swiper');
  if (!swiperEl) return;

  // Ensure it's visible (our scroll animations may set initial opacity)
  swiperEl.style.opacity = '1';
  swiperEl.style.transform = 'translateY(0)';

  // eslint-disable-next-line no-new
  new Swiper('.swiper', {
    loop: true,
    speed: 700,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    keyboard: {
      enabled: true,
    },
    grabCursor: true,
    slidesPerView: 1,
    spaceBetween: 0,
  });
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
    // Disable custom smooth scrolling & progress bar for normal scroll
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