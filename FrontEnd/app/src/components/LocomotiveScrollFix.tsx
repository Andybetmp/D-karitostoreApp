import { useEffect } from 'react';
import { useLocomotiveScroll } from 'react-locomotive-scroll';

/**
 * AGGRESSIVE FIX for locomotive-scroll undefined attribute errors
 * This component runs multiple validation passes to ensure all data-scroll
 * attributes are properly defined before locomotive-scroll processes them
 */
const LocomotiveScrollFix = () => {
    const { scroll } = useLocomotiveScroll();

    useEffect(() => {
        const fixScrollAttributes = () => {
            try {
                // Find all elements with data-scroll attribute
                const scrollElements = document.querySelectorAll('[data-scroll]');

                let fixed = 0;
                scrollElements.forEach((element) => {
                    // List of all possible data-scroll attributes that can cause issues
                    const attributes = [
                        'data-scroll-speed',
                        'data-scroll-direction',
                        'data-scroll-target',
                        'data-scroll-position',
                        'data-scroll-offset',
                        'data-scroll-repeat',
                        'data-scroll-call',
                        'data-scroll-delay',
                        'data-scroll-sticky',
                        'data-scroll-class'
                    ];

                    attributes.forEach(attr => {
                        const value = element.getAttribute(attr);

                        // Check if value is problematic (undefined, null, empty, or literal string 'undefined')
                        if (value === null || value === '' || value === 'undefined' || value === 'null') {
                            if (attr === 'data-scroll-speed') {
                                // Speed must have a value, default to 0
                                element.setAttribute(attr, '0');
                                fixed++;
                            } else if (attr === 'data-scroll-direction') {
                                // Direction should be removed if invalid
                                element.removeAttribute(attr);
                                fixed++;
                            } else if (attr === 'data-scroll-target') {
                                // Target should be removed if invalid
                                element.removeAttribute(attr);
                                fixed++;
                            } else {
                                // Remove any other invalid attributes
                                element.removeAttribute(attr);
                                fixed++;
                            }
                        }
                    });

                    // Ensure data-scroll-speed exists with a valid numeric value
                    const speed = element.getAttribute('data-scroll-speed');
                    if (!speed || isNaN(parseFloat(speed))) {
                        element.setAttribute('data-scroll-speed', '0');
                        fixed++;
                    }
                });

                if (fixed > 0) {
                    console.log(`[LocomotiveScrollFix] Fixed ${fixed} invalid attributes`);
                }

                // Update locomotive scroll if available
                if (scroll) {
                    try {
                        scroll.update();
                    } catch (err) {
                        console.warn('[LocomotiveScrollFix] Error updating scroll:', err);
                    }
                }
            } catch (error) {
                console.warn('[LocomotiveScrollFix] Error in fixScrollAttributes:', error);
            }
        };

        // AGGRESSIVE TIMING STRATEGY
        // Run immediately
        fixScrollAttributes();

        // Run at multiple intervals to catch dynamically added elements
        const timers = [
            setTimeout(fixScrollAttributes, 10),
            setTimeout(fixScrollAttributes, 50),
            setTimeout(fixScrollAttributes, 100),
            setTimeout(fixScrollAttributes, 200),
            setTimeout(fixScrollAttributes, 500),
            setTimeout(fixScrollAttributes, 1000),
            setTimeout(fixScrollAttributes, 2000),
            setTimeout(fixScrollAttributes, 3000)
        ];

        // Set up MutationObserver to catch dynamically added/modified elements
        const observer = new MutationObserver((mutations) => {
            let needsFix = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    needsFix = true;
                }
            });
            if (needsFix) {
                fixScrollAttributes();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [
                'data-scroll',
                'data-scroll-speed',
                'data-scroll-direction',
                'data-scroll-target'
            ]
        });

        // Cleanup
        return () => {
            timers.forEach(timer => clearTimeout(timer));
            observer.disconnect();
        };
    }, [scroll]);

    return null;
};

export default LocomotiveScrollFix;
