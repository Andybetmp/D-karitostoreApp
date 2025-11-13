# TODO: Add Shopping Cart and Checkout Module to D’Karito

## Tasks
- [ ] Update types.d.ts: Add interfaces for Product, CartItem, and Order
- [ ] Create CartContext.tsx: Context for cart state (add, remove, clear, persist to localStorage)
- [ ] Create CartIcon.tsx: Icon component with dynamic counter for header
- [ ] Create CartModal.tsx: Modal/sidebar for cart display, with remove/clear/checkout buttons
- [ ] Modify Shop.tsx: Add "Add to Cart" button to each product
- [ ] Create CheckoutForm.tsx: Form for user details and payment simulation
- [ ] Update App.tsx: Add BrowserRouter, routes for /shop and /checkout, wrap with CartProvider
- [ ] Update NavBar.tsx: Add CartIcon to the menu
- [ ] Update Home.tsx: Ensure NavBar is included if not already

## Followup steps
- [ ] Test cart functionality (add/remove items)
- [ ] Test checkout form validation and simulation
- [ ] Ensure responsiveness on mobile/tablet
- [ ] Verify localStorage persistence
