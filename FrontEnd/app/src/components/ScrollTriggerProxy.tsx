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

    const element = scroll.el as HTMLElement;
    let isMounted = true;

    const initProxy = () => {
      if (!isMounted || !element || !element.isConnected) return;
      try {
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

        if (typeof scroll.update === 'function') {
          scroll.update();
        }

        scroll.on("scroll", ScrollTrigger.update);

        ScrollTrigger.scrollerProxy(element, {
          scrollTop(value) {
            if (!isMounted || !element.isConnected || !scroll?.scroll?.instance) {
              return 0;
            }
            if (arguments.length && typeof value === 'number') {
              scroll.scrollTo(value, { duration: 0, disableLerp: true });
            }
            return scroll.scroll?.instance?.scroll?.y ?? 0;
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            };
          },
          pinType: element.style?.transform ? "transform" : "fixed",
        });

        ScrollTrigger.refresh();
      } catch (error) {
        console.warn('ScrollTrigger proxy setup error:', error);
      }
    };

    const timer = setTimeout(initProxy, 500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      try {
        if (scroll) {
          scroll.off("scroll", ScrollTrigger.update);
          if (scroll.scroll && typeof scroll.scroll.stopScrolling === 'function') {
            scroll.scroll.stopScrolling();
          }
        }
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      } catch (_) {
        // Ignore cleanup errors during unmount
      }
    };
  }, [scroll]);

  return null;
};

export default ScrollTriggerProxy;
