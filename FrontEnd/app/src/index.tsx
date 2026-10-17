import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Guard against locomotive-scroll getTranslate() crash when DOM elements unmount during route transitions.
// In Chromium, getComputedStyle(detachedEl).transform is "" (falsy) and style.mozTransform is undefined,
// causing `style.transform || style.webkitTransform || style.mozTransform` to evaluate to undefined.
if (typeof window !== 'undefined') {
  if (typeof CSSStyleDeclaration !== 'undefined') {
    try {
      Object.defineProperty(CSSStyleDeclaration.prototype, 'mozTransform', {
        get() {
          return this.transform || this.webkitTransform || 'none';
        },
        configurable: true,
      });
    } catch (_) {
      // Ignore if read-only
    }
  }

  const origGetComputedStyle = window.getComputedStyle.bind(window);
  window.getComputedStyle = function (elt: Element, pseudoElt?: string | null): CSSStyleDeclaration {
    try {
      if (!elt || !(elt instanceof Element)) {
        return { transform: 'none', webkitTransform: 'none', mozTransform: 'none' } as unknown as CSSStyleDeclaration;
      }
      return origGetComputedStyle(elt, pseudoElt);
    } catch (_) {
      return { transform: 'none', webkitTransform: 'none', mozTransform: 'none' } as unknown as CSSStyleDeclaration;
    }
  };
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
