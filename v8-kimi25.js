/**
 * v8-kimi25.js - Optimized JavaScript with performance and accessibility improvements
 */

(function() {
    'use strict';

    // ===== Session-based intro animation caching =====
    const hasSeenIntro = sessionStorage.getItem('v8-hero-intro');
    if (hasSeenIntro) {
        document.body.classList.add('skip-intro');
    } else {
        sessionStorage.setItem('v8-hero-intro', 'true');
    }

    // ===== Check for reduced motion preference =====
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== Cache DOM queries =====
    const domCache = {
        orbs: null,
        sections: null,
        progressDots: null,
        marqueeTrack: null,
        emailInputs: null
    };

    // Initialize cache on DOM ready
    function cacheDOMElements() {
        domCache.orbs = document.querySelectorAll('.accent-orb');
        domCache.sections = document.querySelectorAll('section[id]');
        domCache.progressDots = document.querySelectorAll('.progress-dot');
        domCache.marqueeTrack = document.querySelector('.app-marquee-track');
        domCache.emailInputs = document.querySelectorAll('.v8-email-input');
    }

    // ===== GSAP Initialization with Error Handling =====
    let gsapReady = false;

    function initGSAP() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP not loaded - falling back to native animations');
            initFallbackAnimations();
            return;
        }

        try {
            gsap.registerPlugin(ScrollTrigger);
            gsapReady = true;

            if (!prefersReducedMotion) {
                document.body.classList.add('gsap-ready');
                initGSAPAnimations();
            }
        } catch (error) {
            console.error('GSAP initialization failed:', error);
            initFallbackAnimations();
        }
    }

    function initGSAPAnimations() {
        // Demo window scale animation
        const demoWindow = document.querySelector('.demo-window');
        if (demoWindow) {
            gsap.to(demoWindow, {
                scale: 1,
                borderRadius: '12px',
                scrollTrigger: {
                    trigger: demoWindow,
                    start: 'top 90%',
                    end: 'top 30%',
                    scrub: 1.2
                }
            });
        }

        // Parallax on accent orbs
        if (domCache.orbs && domCache.orbs.length >= 3) {
            gsap.to(domCache.orbs[0], {
                y: -80,
                scrollTrigger: {
                    trigger: '.v8-hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 2
                }
            });

            gsap.to(domCache.orbs[1], {
                y: -50,
                x: 30,
                scrollTrigger: {
                    trigger: '.v8-hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 2.5
                }
            });

            gsap.to(domCache.orbs[2], {
                y: -60,
                scrollTrigger: {
                    trigger: '.v8-hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.8
                }
            });
        }

        // Section reveal animations
        const animatedSections = document.querySelectorAll('.animate-on-scroll');
        animatedSections.forEach((section) => {
            gsap.fromTo(section,
                { opacity: 0.6, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.0,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Staggered children reveal
        document.querySelectorAll('.stagger-children').forEach(container => {
            const children = container.children;
            gsap.fromTo(children,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: container,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Demo conversation animation
        const demoMessages = document.querySelectorAll('.demo-message');
        demoMessages.forEach((message, index) => {
            gsap.fromTo(message,
                { opacity: 0, y: 10 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: index * 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.demo-window',
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }

    function initFallbackAnimations() {
        // Make all animated elements visible immediately
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });

        document.querySelectorAll('.stagger-children > *').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });

        // Add native IntersectionObserver for simple fade-in
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                observer.observe(el);
            });
        }
    }

    // ===== Throttled Mouse Parallax =====
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let lastMouseMove = 0;
    let mouseTimeout = null;
    let isMouseActive = false;

    function initMouseParallax() {
        if (prefersReducedMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            return;
        }

        if (!domCache.orbs || domCache.orbs.length === 0) return;

        // Throttled mousemove handler
        document.addEventListener('mousemove', (e) => {
            const now = performance.now();
            if (now - lastMouseMove < 16) return; // Throttle to ~60fps
            lastMouseMove = now;

            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

            if (!isMouseActive) {
                isMouseActive = true;
                requestAnimationFrame(animateOrbs);
            }

            // Clear timeout to stop animation after inactivity
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                isMouseActive = false;
            }, 100);
        }, { passive: true });
    }

    function animateOrbs() {
        if (!isMouseActive) return;

        // Smooth interpolation
        targetX += (mouseX - targetX) * 0.03;
        targetY += (mouseY - targetY) * 0.03;

        domCache.orbs.forEach((orb, index) => {
            const factor = (index + 1) * 6;
            const offsetX = targetX * factor;
            const offsetY = targetY * factor;
            orb.style.setProperty('--mouse-x', `${offsetX}px`);
            orb.style.setProperty('--mouse-y', `${offsetY}px`);
        });

        requestAnimationFrame(animateOrbs);
    }

    // ===== Intersection Observer for Animation Pause =====
    function initVisibilityObservers() {
        if (prefersReducedMotion) return;

        const observerOptions = { threshold: 0 };

        // Pause orbs when off-screen
        if (domCache.orbs && domCache.orbs.length > 0) {
            const orbObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    entry.target.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
                });
            }, observerOptions);

            domCache.orbs.forEach(orb => orbObserver.observe(orb));
        }

        // Pause marquee when off-screen
        if (domCache.marqueeTrack) {
            const marqueeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    entry.target.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
                });
            }, observerOptions);

            marqueeObserver.observe(domCache.marqueeTrack);
        }
    }

    // ===== Progress Navigation =====
    function initProgressNav() {
        if (!domCache.progressDots || !domCache.sections) return;

        const observerOptions = {
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeSection = entry.target.id;
                    domCache.progressDots.forEach(dot => {
                        const isActive = dot.dataset.section === activeSection;
                        dot.classList.toggle('active', isActive);
                        dot.setAttribute('aria-current', isActive.toString());
                    });
                }
            });
        }, observerOptions);

        domCache.sections.forEach(section => observer.observe(section));

        // Keyboard navigation for progress dots
        domCache.progressDots.forEach(dot => {
            dot.addEventListener('keydown', (e) => {
                const dots = Array.from(domCache.progressDots);
                const currentIndex = dots.indexOf(dot);
                let targetIndex;

                switch (e.key) {
                    case 'ArrowDown':
                    case 'ArrowRight':
                        e.preventDefault();
                        targetIndex = (currentIndex + 1) % dots.length;
                        break;
                    case 'ArrowUp':
                    case 'ArrowLeft':
                        e.preventDefault();
                        targetIndex = (currentIndex - 1 + dots.length) % dots.length;
                        break;
                    case 'Home':
                        e.preventDefault();
                        targetIndex = 0;
                        break;
                    case 'End':
                        e.preventDefault();
                        targetIndex = dots.length - 1;
                        break;
                    default:
                        return;
                }

                dots[targetIndex].focus();
                dots[targetIndex].click();
            });
        });
    }

    // ===== Email Validation =====
    function initEmailValidation() {
        if (!domCache.emailInputs) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        domCache.emailInputs.forEach(input => {
            const errorId = input.getAttribute('aria-describedby')?.split(' ')[1];
            const errorElement = errorId ? document.getElementById(errorId) : null;

            input.addEventListener('input', function() {
                const value = this.value.trim();
                const isValid = emailRegex.test(value);

                if (value === '') {
                    this.classList.remove('valid', 'invalid');
                    this.setAttribute('aria-invalid', 'false');
                    if (errorElement) errorElement.textContent = '';
                } else if (isValid) {
                    this.classList.remove('invalid');
                    this.classList.add('valid');
                    this.setAttribute('aria-invalid', 'false');
                    if (errorElement) errorElement.textContent = '';
                } else {
                    this.classList.remove('valid');
                    this.classList.add('invalid');
                    this.setAttribute('aria-invalid', 'true');
                    if (errorElement) errorElement.textContent = 'Please enter a valid email address';
                }
            });

            input.addEventListener('blur', function() {
                const value = this.value.trim();
                if (value !== '' && !emailRegex.test(value)) {
                    this.classList.add('invalid');
                    this.setAttribute('aria-invalid', 'true');
                    if (errorElement) errorElement.textContent = 'Please enter a valid email address';
                }
            });

            // Prevent form submission if invalid
            const form = input.closest('form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    const value = input.value.trim();
                    if (!emailRegex.test(value)) {
                        e.preventDefault();
                        input.focus();
                        input.classList.add('invalid');
                        input.setAttribute('aria-invalid', 'true');
                        if (errorElement) {
                            errorElement.textContent = 'Please enter a valid email address before submitting';
                        }
                    }
                });
            }
        });
    }

    // ===== Analytics Tracking Setup =====
    function initAnalytics() {
        // Track CTA clicks
        document.querySelectorAll('[data-track]').forEach(element => {
            element.addEventListener('click', (e) => {
                const trackEvent = element.getAttribute('data-track');
                
                // Send to analytics if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        event_category: 'engagement',
                        event_label: trackEvent
                    });
                }

                if (typeof fbq !== 'undefined') {
                    fbq('trackCustom', trackEvent);
                }

                // Console log for debugging (remove in production)
                console.log('Track:', trackEvent);
            });
        });

        // Track form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'conversion', {
                        event_category: 'lead',
                        event_label: 'beta_signup'
                    });
                }
            });
        });
    }

    // ===== Cleanup Function =====
    function cleanup() {
        // Disconnect observers
        if (window.observers) {
            window.observers.forEach(observer => observer.disconnect());
        }

        // Clear timeouts
        clearTimeout(mouseTimeout);

        // Kill GSAP animations
        if (gsapReady && typeof gsap !== 'undefined') {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
    }

    // ===== Initialize Everything =====
    function init() {
        cacheDOMElements();
        initGSAP();
        initMouseParallax();
        initVisibilityObservers();
        initProgressNav();
        initEmailValidation();
        initAnalytics();

        // Setup cleanup on page unload
        window.addEventListener('beforeunload', cleanup);

        // Handle visibility change for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause expensive animations when tab is hidden
                document.body.classList.add('tab-hidden');
            } else {
                document.body.classList.remove('tab-hidden');
            }
        });
    }

    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
