(function() {
    // Session-based intro animation caching
    // Skip hero animations for returning visitors in the same session
    const hasSeenIntro = sessionStorage.getItem('v8-hero-intro');
    if (hasSeenIntro) {
        document.body.classList.add('skip-intro');
    } else {
        sessionStorage.setItem('v8-hero-intro', 'true');
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // GSAP ScrollTrigger - Demo window expansion and scroll-based parallax
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        if (!prefersReducedMotion) {
            // Add class to indicate GSAP is ready (enables scaled-down initial state)
            document.body.classList.add('gsap-ready');

            // Demo window scale animation
            gsap.to('.demo-window', {
                scale: 1,
                borderRadius: '12px',
                scrollTrigger: {
                    trigger: '.demo-window',
                    start: 'top 90%',
                    end: 'top 30%',
                    scrub: 1.2
                }
            });

            // Gentle parallax on accent orbs during scroll
            gsap.to('.accent-orb-1', {
                y: -80,
                scrollTrigger: {
                    trigger: '.v8-hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 2
                }
            });

            gsap.to('.accent-orb-2', {
                y: -50,
                x: 30,
                scrollTrigger: {
                    trigger: '.v8-hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 2.5
                }
            });

            gsap.to('.accent-orb-3', {
                y: -60,
                scrollTrigger: {
                    trigger: '.v8-hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.8
                }
            });

            // Subtle scroll reveal for sections
            const sections = document.querySelectorAll('.animate-on-scroll');
            sections.forEach((section, index) => {
                gsap.fromTo(section,
                    {
                        opacity: 0.6,
                        y: 30
                    },
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
                    {
                        opacity: 0,
                        y: 20
                    },
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

            // Interactive demo conversation animation
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
    }

    // Subtle mouse parallax on orbs (desktop only)
    if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const orbs = document.querySelectorAll('.accent-orb');
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        function animateOrbs() {
            // Smooth interpolation
            targetX += (mouseX - targetX) * 0.03;
            targetY += (mouseY - targetY) * 0.03;

            orbs.forEach((orb, index) => {
                const factor = (index + 1) * 6;
                const offsetX = targetX * factor;
                const offsetY = targetY * factor;
                orb.style.setProperty('--mouse-x', `${offsetX}px`);
                orb.style.setProperty('--mouse-y', `${offsetY}px`);
            });

            requestAnimationFrame(animateOrbs);
        }
        animateOrbs();
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

    // Make all sections visible immediately if GSAP didn't load
    if (typeof gsap === 'undefined') {
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('animate-in');
        });
    }

    // Progress nav active state
    const progressDots = document.querySelectorAll('.progress-dot');
    const sections = document.querySelectorAll('section[id]');

    if (progressDots.length && sections.length) {
        const observerOptions = {
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeSection = entry.target.id;
                    progressDots.forEach(dot => {
                        dot.classList.remove('active');
                        if (dot.dataset.section === activeSection) {
                            dot.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }
})();

// Email validation - visual feedback only, let HTML5 validation handle submit
const emailInputs = document.querySelectorAll('.v8-email-input');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

emailInputs.forEach(input => {
    input.addEventListener('input', function() {
        const value = this.value.trim();
        const isValid = emailRegex.test(value);

        if (value === '') {
            this.classList.remove('valid', 'invalid');
            this.removeAttribute('aria-invalid');
        } else if (isValid) {
            this.classList.remove('invalid');
            this.classList.add('valid');
            this.setAttribute('aria-invalid', 'false');
        } else {
            this.classList.remove('valid');
            this.classList.add('invalid');
            this.setAttribute('aria-invalid', 'true');
        }
    });

    input.addEventListener('blur', function() {
        const value = this.value.trim();
        if (value !== '' && !emailRegex.test(value)) {
            this.classList.add('invalid');
            this.setAttribute('aria-invalid', 'true');
        }
    });
});
