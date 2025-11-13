import { ThemeProvider } from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";
import { dark } from "./styles/Themes";
import { LocomotiveScrollProvider } from "react-locomotive-scroll";
import { useEffect, useRef, useState } from "react";
import 'locomotive-scroll/dist/locomotive-scroll.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Routes, Route } from 'react-router-dom';

import Home from "./sections/Home";
import { AnimatePresence } from "framer-motion";
import About from "./sections/About";
import Shop from "./sections/Shop";
import ScrollTriggerProxy from './components/ScrollTriggerProxy';
import Banner from "./sections/Banner";
import NewArrival from "./sections/NewArrival";
import Footer from './sections/Footer';
import Loader from "./components/Loader";
import LoginModal from "./components/LoginModal";
import CartModal from "./components/CartModal";
import CheckoutForm from "./components/CheckoutForm";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";


function App() {
  const containerRef = useRef(null);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 3000);
  }, [])
  

  return (
    <>
      <GlobalStyles />
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID_HERE">
        <AuthProvider>
          <CartProvider>
            <ThemeProvider theme={dark}>
              <Routes>
                <Route path="/" element={
                  <LocomotiveScrollProvider
                    options={{
                      smooth: true,
                      smartphone: { smooth: true },
                      tablet: { smooth: true }
                    }}
                    watch={[]}
                    containerRef={containerRef}
                  >
                    <AnimatePresence>
                      {loaded ? null : <Loader />}
                    </AnimatePresence>
                    <ScrollTriggerProxy />
                    <AnimatePresence>
                      <main className='App' data-scroll-container ref={containerRef}>
                        <Home />
                        <About />
                        <Shop />
                        <Banner />
                        <NewArrival />
                        <Footer />
                      </main>
                    </AnimatePresence>
                    <LoginModal />
                    <CartModal />
                  </LocomotiveScrollProvider>
                } />
                <Route path="/checkout" element={<CheckoutForm />} />
              </Routes>
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
