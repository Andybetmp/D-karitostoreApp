// To use gsap with locomotive scroll, we have to use scroller proxy provided by gsap
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { useLocomotiveScroll } from "react-locomotive-scroll";

const ScrollTriggerProxy = () => {
  const { scroll } = useLocomotiveScroll();

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    if (!scroll || !scroll.el) return;

    const element = scroll.el;

    // Wait for locomotive scroll to be fully initialized
    const initProxy = () => {
      try {
        // Ensure all data-scroll elements have valid speed attributes
        const scrollElements = element.querySelectorAll('[data-scroll]');
        scrollElements.forEach((el) => {
          if (!el.hasAttribute('data-scroll-speed')) {
            el.setAttribute('data-scroll-speed', '0');
          }
          const speed = el.getAttribute('data-scroll-speed');
          if (!speed || speed === 'undefined' || speed === 'null') {
            el.setAttribute('data-scroll-speed', '0');
          }
        });

        // Update locomotive scroll
        scroll.update();

        // Setup ScrollTrigger proxy
        scroll.on("scroll", ScrollTrigger.update);

        ScrollTrigger.scrollerProxy(element, {
          scrollTop(value) {
            return arguments.length
              ? scroll.scrollTo(value, 0, 0)
              : scroll.scroll.instance.scroll.y;
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            };
          },
          pinType: element.style.transform ? "transform" : "fixed",
        });

        // Refresh ScrollTrigger after setup
        ScrollTrigger.refresh();
      } catch (error) {
        console.warn('ScrollTrigger proxy setup error:', error);
      }
    };

    // Delay initialization to ensure DOM is ready
    const timer = setTimeout(initProxy, 500);

    return () => {
      clearTimeout(timer);
      if (scroll) {
        scroll.off("scroll", ScrollTrigger.update);
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scroll]);

  return null;
};

export default ScrollTriggerProxy;
