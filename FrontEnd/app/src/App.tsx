import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { ThemeProvider } from '@mui/material/styles';
import muiTheme from './theme/theme';
import GlobalStyles from "./styles/GlobalStyles";
import { dark } from "./styles/Themes";
import { LocomotiveScrollProvider } from "react-locomotive-scroll";
import { useEffect, useRef, useState } from "react";
import 'locomotive-scroll/dist/locomotive-scroll.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Routes, Route, useLocation } from 'react-router-dom';

import Home from "./components/sections/Home";
import { AnimatePresence } from "framer-motion";
import About from "./components/sections/About";
import Shop from "./components/sections/Shop";
import ScrollTriggerProxy from './components/ScrollTriggerProxy';
import Banner from "./components/sections/Banner";
import NewArrival from "./components/sections/NewArrival";
import Footer from "./components/sections/Footer";
import Loader from "./components/Loader";
import LoginModal from "./components/LoginModal";
import CartModal from "./components/CartModal";
import CheckoutForm from "./components/CheckoutForm";
import FloatingCartButton from "./components/FloatingCartButton";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Login from "./pages/authentication/Login";
import SignUp from "./pages/authentication/SignUp";
import Dashboard from "./pages/dashboard/Dashboard";
import ProductManagement from "./pages/dashboard/ProductManagement";
import { rootPaths } from "./routes/paths";
import BreakpointsProvider from 'providers/BreakpointsProvider';
import MainLayout from './layouts/main-layout';
import LocomotiveScrollFix from './components/LocomotiveScrollFix';
import ProtectedRoute from './components/ProtectedRoute';
import MyOrders from './pages/orders/MyOrders';


function App() {
  const location = useLocation();
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 3000);
  }, [])

  // Rutas donde NO debe aparecer el carrito flotante
  const hideCartRoutes = ['/dashboard', '/login', '/authentication/sign-up', '/admin', '/profile', '/settings'];
  const shouldShowCart = !hideCartRoutes.some(route => location.pathname.startsWith(route));


  return (
    <>
      <GlobalStyles />
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID_HERE">
        <AuthProvider>
          <CartProvider>
            <StyledThemeProvider theme={dark}>
              <ThemeProvider theme={muiTheme}>
                <BreakpointsProvider>
                  {shouldShowCart && <FloatingCartButton />}
                  <CartModal />
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
                        <LocomotiveScrollFix />
                        <AnimatePresence>
                          {loaded ? null : <Loader />}
                        </AnimatePresence>
                        <ScrollTriggerProxy />
                        <main className='App' data-scroll-container ref={containerRef}>
                          <Home />
                          <About />
                          <Shop />
                          <Banner />
                          <NewArrival />
                          <Footer />
                        </main>
                        <LoginModal />
                      </LocomotiveScrollProvider>
                    } />
                    <Route path="/checkout" element={<CheckoutForm />} />
                    <Route path="/admin" element={<div>Admin Panel - Coming Soon</div>} />
                    <Route path="/login" element={<Login />} />
                    <Route path={rootPaths.dashboard} element={
                      <ProtectedRoute requireAdmin={false}>
                        <MainLayout>
                          <Dashboard />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/my-orders" element={
                      <MainLayout>
                        <MyOrders />
                      </MainLayout>
                    } />
                    <Route path="/dashboard/products" element={
                      <ProtectedRoute requireAdmin={true}>
                        <MainLayout>
                          <ProductManagement />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/authentication/sign-up" element={<SignUp />} />
                  </Routes>
                </BreakpointsProvider>
              </ThemeProvider>
            </StyledThemeProvider>
          </CartProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
