import { useEffect } from 'react';

/**
 * Hook to fix locomotive-scroll data-scroll-speed undefined errors
 * This validates and fixes all data-scroll-speed attributes before locomotive-scroll processes them
 */
const useLocomotiveScrollFix = () => {
    useEffect(() => {
        // Wait for DOM to be ready
        const fixScrollAttributes = () => {
            // Find all elements with data-scroll attribute
            const scrollElements = document.querySelectorAll('[data-scroll]');

            scrollElements.forEach((element) => {
                const speed = element.getAttribute('data-scroll-speed');

                // If data-scroll-speed is undefined, null, or empty, set it to "0"
                if (!speed || speed === 'undefined' || speed === 'null' || speed.trim() === '') {
                    element.setAttribute('data-scroll-speed', '0');
                }

                // Ensure data-scroll-direction has a valid value
                const direction = element.getAttribute('data-scroll-direction');
                if (direction && (direction === 'undefined' || direction === 'null' || direction.trim() === '')) {
                    element.removeAttribute('data-scroll-direction');
                }
            });
        };

        // Run immediately
        fixScrollAttributes();

        // Run again after a short delay to catch dynamically added elements
        const timeoutId = setTimeout(fixScrollAttributes, 100);

        // Cleanup
        return () => clearTimeout(timeoutId);
    }, []);
};

export default useLocomotiveScrollFix;
