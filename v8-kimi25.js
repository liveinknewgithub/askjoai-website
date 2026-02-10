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
        emailInputs: null
    };

    // Initialize cache on DOM ready
    function cacheDOMElements() {
        domCache.orbs = document.querySelectorAll('.accent-orb');
        domCache.sections = document.querySelectorAll('section[id]');
        domCache.progressDots = document.querySelectorAll('.progress-dot');
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
        // No scroll-triggered animations on marketing pages (Emil principle:
        // no fade-ups, translate-Y on scroll, no disconnected parallax).
        // GSAP is kept registered for potential future scrubbed 1:1 interactions.
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

        // Pause looping animations when off-screen
        const loopingSelectors = [
            '.comparison-card--spotlight',
            '.feature-refined--hero',
            '.testimonial-refined--sarah',
            '.feature-icon-wrapper',
            '.testimonial-refined',
            '.step-icon'
        ];
        const loopingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
            });
        }, observerOptions);

        loopingSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => loopingObserver.observe(el));
        });
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

            // Prevent form submission if invalid, disable button after valid submit
            const form = input.closest('form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    const value = input.value.trim();
                    const submitBtn = form.querySelector('button[type="submit"]');
                    if (!emailRegex.test(value)) {
                        e.preventDefault();
                        input.focus();
                        input.classList.add('invalid');
                        input.setAttribute('aria-invalid', 'true');
                        if (errorElement) {
                            errorElement.textContent = 'Please enter a valid email address before submitting';
                        }
                    } else if (submitBtn) {
                        submitBtn.disabled = true;
                        submitBtn.textContent = 'Submitting\u2026';
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

        // Kill GSAP animations
        if (gsapReady && typeof gsap !== 'undefined') {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
    }

    // ===== Initialize Everything =====
    function init() {
        cacheDOMElements();
        initGSAP();
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
