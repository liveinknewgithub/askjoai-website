(function() {
    // Session-based intro animation caching
    // Skip hero animations for returning visitors in the same session
    const hasSeenIntro = sessionStorage.getItem('v7-hero-intro');
    if (hasSeenIntro) {
        document.body.classList.add('skip-intro');
    } else {
        sessionStorage.setItem('v7-hero-intro', 'true');
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // GSAP ScrollTrigger - Demo window expansion
    // Only runs if GSAP loaded successfully
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        if (!prefersReducedMotion) {
            // Add class to indicate GSAP is ready (enables scaled-down initial state)
            document.body.classList.add('gsap-ready');

            gsap.to('.demo-window', {
                scale: 1,
                borderRadius: '8px',
                scrollTrigger: {
                    trigger: '.demo-window',
                    start: 'top 90%',
                    end: 'top 30%',
                    scrub: 0.8
                }
            });
        }
    }

    // Pause looping animations when off-screen (saves GPU resources)
    if (!prefersReducedMotion) {
        // Pause accent orbs when not visible
        const orbs = document.querySelectorAll('.accent-orb');
        const orbObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
            });
        }, { threshold: 0 });
        orbs.forEach(orb => orbObserver.observe(orb));

        // Pause marquee when not visible
        const marqueeTrack = document.querySelector('.app-marquee-track');
        if (marqueeTrack) {
            const marqueeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    entry.target.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
                });
            }, { threshold: 0 });
            marqueeObserver.observe(marqueeTrack);
        }

        // Pause demo placeholder pulse when not visible
        const demoPulse = document.querySelector('.demo-placeholder-icon');
        if (demoPulse) {
            const pulseObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    entry.target.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
                });
            }, { threshold: 0 });
            pulseObserver.observe(demoPulse);
        }
    }

    // Make all sections visible immediately (no scroll-triggered fades)
    // Per Emil's guidelines: "No scroll animations on marketing pages"
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.add('animate-in');
    });
})();

// Email validation
const emailInputs = document.querySelectorAll('.v7-email-input');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

emailInputs.forEach(input => {
    const form = input.closest('form');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

    // Disable button initially
    if (submitBtn) submitBtn.disabled = true;

    input.addEventListener('input', function() {
        const value = this.value.trim();
        const isValid = emailRegex.test(value);

        if (value === '') {
            this.classList.remove('valid', 'invalid');
        } else if (isValid) {
            this.classList.remove('invalid');
            this.classList.add('valid');
        } else {
            this.classList.remove('valid');
            this.classList.add('invalid');
        }

        // Enable/disable submit button
        if (submitBtn) submitBtn.disabled = !isValid;
    });

    input.addEventListener('blur', function() {
        const value = this.value.trim();
        if (value !== '' && !emailRegex.test(value)) {
            this.classList.add('invalid');
        }
    });
});
