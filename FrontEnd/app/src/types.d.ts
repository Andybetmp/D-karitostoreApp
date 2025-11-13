declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module 'styled-components' {
  export interface DefaultTheme {
    body: string;
    text: string;
    bodyRgba: string;
    textRgba: string;
    grey: string;
    fontxs: string;
    fontsm: string;
    fontmd: string;
    fontlg: string;
    fontxl: string;
    fontxxl: string;
    fontxxxl: string;
    fontBig: string;
    navHeight: string;
  }
  export const ThemeProvider: any;
  export const createGlobalStyle: any;
  export default any;
}

declare module 'styled-components/native' {
  export * from 'styled-components';
}

declare module 'framer-motion' {
  export const motion: any;
  export const AnimatePresence: any;
  export interface MotionProps {
    children?: React.ReactNode;
  }
}

declare module 'react-dom' {
  export function render(element: React.ReactElement, container: Element | null): void;
}

declare module 'gsap' {
  export interface ScrollTrigger {
    kill(): void;
    refresh(): void;
  }
  export const ScrollTrigger: {
    kill(): void;
    refresh(): void;
    getAll(): any[];
  };
}

declare global {
  interface Window {
    gtag: any;
  }
}

// Shopping Cart Types
export interface Product {
  id: string;
  img: string;
  title: string;
  price?: number; // Optional, can be added later
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: CartItem[];
  total: number;
  paymentMethod: 'card' | 'wallet';
  cardDetails?: {
    number: string;
    expiry: string;
    cvv: string;
  };
  createdAt: Date;
}

// Fix for styled-components Tab component
declare module 'styled-components' {
  export interface ThemedStyledProps<P, T> {
    active?: boolean;
  }
}
