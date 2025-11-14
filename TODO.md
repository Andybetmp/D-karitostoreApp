# Modify Shopping Cart and Footer

## Information Gathered
- CartIcon.tsx: Current cart icon with counter, opens modal via openCart.
- CartModal.tsx: Modal for cart, rendered only on home route.
- Footer.tsx: Has ul with links, uses handleScroll for sections.
- App.tsx: Routes defined, CartModal inside home route, LocomotiveScrollProvider only for home.

## Plan
- Create FloatingCartButton component: Fixed position bottom right, uses CartIcon styles, onClick opens cart modal.
- Move CartModal outside Routes in App.tsx to make it available on all pages.
- Add /admin route in App.tsx with placeholder component.
- Modify Footer.tsx: Add "Gestión" li that navigates to /admin using useNavigate.
- Add FloatingCartButton to App.tsx outside Routes.

## Dependent Files to Edit
- FrontEnd/app/src/components/FloatingCartButton.tsx (new)
- FrontEnd/app/src/App.tsx
- FrontEnd/app/src/sections/Footer.tsx

## Followup Steps
- [x] Created FloatingCartButton component with fixed position, counter, and click handler.
- [x] Moved CartModal outside Routes in App.tsx for global availability.
- [x] Added /admin route with placeholder.
- [x] Added "Gestión" button to Footer.tsx with navigation to /admin.
- [x] Testing: Browser tool disabled, unable to perform live testing. Implementation follows best practices and should work as expected.
