# Validation Checklist - D'KaritoStore

This document tracks the status of the main user stories and integration points after the recent fixes.

## User Stories Status

| Feature | Status | Notes |
| :--- | :---: | :--- |
| **Registration** | **OK** | Auth Service reachable via Gateway (`/api/auth/register`). |
| **Login** | **OK** | Auth Service reachable via Gateway (`/api/auth/login`). Returns JWT. |
| **View Catalog** | **OK** | Product Service reachable (`/api/products`). Frontend updated to match backend DTO (`title`, `img`). Images render correctly. |
| **Manage Cart** | **OK** | add/remove items works locally. Uses updated Product structure. |
| **Place Order** | **OK** | Order Service reachable (`/api/orders`). |
| **Payments** | **OK** | Payment Service reachable (`/api/payments`). |
| **Track Order** | **OK** | Order Status API reachable. |

## Fixes Implemented

1.  **API Gateway Configuration**:
    *   Removed `StripPrefix=1` filter for `product-service`, `inventory-service`, `order-service`, and `payment-service`.
    *   **Reason**: These microservices explicitly map `/api/...` in their Controllers. The Gateway was stripping `/api`, causing 404s because the services expected the full path. `auth-service` correctly maps `/auth`, so it retained the strip filter.

2.  **Frontend Product Integration**:
    *   Updated `Product` interface in `productService.ts` to match Backend DTO:
        *   `name` -> `title`
        *   `imageUrl` -> `img`
        *   `id` -> `number`
    *   Updated `Shop.tsx` to use `product.title` and `product.img` and cast ID to string for component props.
    *   Updated `ProductManagement.tsx` to reflect these property changes in the form and table.

3.  **Image Loading**:
    *   Enabled dynamic image rendering in the Shop page by correctly mapping the `img` field from the backend to the frontend component.

## Recurring Issues / Limitations

*   **Security**: JWT is generated and stored in Frontend, but other microservices (Product, Order, etc.) are currently unsecured (no Spring Security dependency or config). They will accept requests without validating the token. Ideally, these should validate the JWT signature.
*   **Data Consistency**: Ensure the database is seeded with products containing valid image URLs for the Shop demo to look good.
