/**
 * Density Slider for v8-warm-density.html
 * Controls page content visibility based on reading depth preference
 *
 * Levels:
 * 1 = Quick (hero + CTA + footer)
 * 2 = Standard (Quick + demo + comparison + pricing)
 * 3 = Full (everything)
 */

(function() {
    'use strict';

    const DENSITY_LEVELS = {
        1: 'quick',
        2: 'standard',
        3: 'full'
    };

    const DENSITY_VALUES = {
        'quick': 1,
        'standard': 2,
        'full': 3
    };

    const DENSITY_LABELS = {
        'quick': 'Quick View',
        'standard': 'Standard View',
        'full': 'Full Page'
    };

    const STORAGE_KEY = 'jo-density-preference';

    /**
     * Get initial density from URL param or localStorage
     */
    function getInitialDensity() {
        // Check URL param first
        const urlParams = new URLSearchParams(window.location.search);
        const urlDensity = urlParams.get('density');
        if (urlDensity && DENSITY_VALUES[urlDensity]) {
            return urlDensity;
        }

        // Check localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && DENSITY_VALUES[stored]) {
            return stored;
        }

        // Default to full
        return 'full';
    }

    /**
     * Update URL without page reload
     */
    function updateURL(density) {
        const url = new URL(window.location.href);
        url.searchParams.set('density', density);
        window.history.replaceState({}, '', url);
    }

    /**
     * Save preference to localStorage
     */
    function savePreference(density) {
        try {
            localStorage.setItem(STORAGE_KEY, density);
        } catch (e) {
            // localStorage might be unavailable
            console.warn('Could not save density preference:', e);
        }
    }

    /**
     * Update section visibility based on density level
     */
    function updateSectionVisibility(density) {
        const densityValue = DENSITY_VALUES[density];
        const sections = document.querySelectorAll('section[data-density]');

        sections.forEach(section => {
            const sectionLevel = section.getAttribute('data-density');
            const sectionValue = DENSITY_VALUES[sectionLevel];

            if (sectionValue <= densityValue) {
                // Show this section
                section.classList.remove('density-hidden');
            } else {
                // Hide this section
                section.classList.add('density-hidden');
            }
        });
    }

    /**
     * Update slider UI state
     */
    function updateSliderUI(density) {
        const slider = document.querySelector('.density-slider');
        const input = document.querySelector('.density-input');
        const label = document.querySelector('.density-label');

        if (slider) {
            slider.setAttribute('data-density', density);
        }

        if (input) {
            input.value = DENSITY_VALUES[density];
        }

        if (label) {
            label.textContent = DENSITY_LABELS[density];
        }
    }

    /**
     * Set density level
     */
    function setDensity(density) {
        updateSectionVisibility(density);
        updateSliderUI(density);
        updateURL(density);
        savePreference(density);
    }

    /**
     * Handle slider input change
     */
    function handleSliderChange(event) {
        const value = parseInt(event.target.value, 10);
        const density = DENSITY_LEVELS[value];
        if (density) {
            setDensity(density);
        }
    }

    /**
     * Handle icon button clicks
     */
    function handleQuickClick() {
        setDensity('quick');
    }

    function handleFullClick() {
        setDensity('full');
    }

    /**
     * Handle keyboard navigation on slider
     */
    function handleSliderKeydown(event) {
        const input = event.target;
        const currentValue = parseInt(input.value, 10);

        // Support arrow keys for fine-grained control
        if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            if (currentValue > 1) {
                input.value = currentValue - 1;
                handleSliderChange({ target: input });
            }
            event.preventDefault();
        } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            if (currentValue < 3) {
                input.value = currentValue + 1;
                handleSliderChange({ target: input });
            }
            event.preventDefault();
        }
    }

    /**
     * Initialize the density slider
     */
    function init() {
        // Add body class for padding
        document.body.classList.add('has-density-slider');

        // Get initial density
        const initialDensity = getInitialDensity();

        // Set up event listeners
        const sliderInput = document.querySelector('.density-input');
        const quickBtn = document.querySelector('.density-icon--quick');
        const fullBtn = document.querySelector('.density-icon--full');

        if (sliderInput) {
            sliderInput.addEventListener('input', handleSliderChange);
            sliderInput.addEventListener('keydown', handleSliderKeydown);
        }

        if (quickBtn) {
            quickBtn.addEventListener('click', handleQuickClick);
        }

        if (fullBtn) {
            fullBtn.addEventListener('click', handleFullClick);
        }

        // Apply initial state
        setDensity(initialDensity);

        // Listen for URL changes (back/forward navigation)
        window.addEventListener('popstate', () => {
            const density = getInitialDensity();
            setDensity(density);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
