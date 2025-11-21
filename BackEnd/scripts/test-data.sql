-- D'Karito Store Test Data
-- Comprehensive test data for all microservices
-- Run this after db-setup.sql to populate the database with sample data

-- Clean existing test data (optional - comment out if you want to keep existing data)
-- DELETE FROM payments;
-- DELETE FROM order_items;
-- DELETE FROM orders;
-- DELETE FROM inventory;
-- DELETE FROM products;
-- DELETE FROM user_roles;
-- DELETE FROM users;

-- Reset sequences (optional)
-- ALTER SEQUENCE users_id_seq RESTART WITH 1;
-- ALTER SEQUENCE products_id_seq RESTART WITH 1;
-- ALTER SEQUENCE orders_id_seq RESTART WITH 1;
-- ALTER SEQUENCE payments_id_seq RESTART WITH 1;

-- ===== USERS AND ROLES =====
-- Password for all test users is: "password123" (BCrypt hashed)
-- $2a$10$YourHashHere would be the real hash

INSERT INTO users (email, password, name, picture, provider, created_at, updated_at) VALUES
('admin@dkarito.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin User', 'https://i.pravatar.cc/150?img=1', 'EMAIL', NOW(), NOW()),
('john.doe@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John Doe', 'https://i.pravatar.cc/150?img=12', 'EMAIL', NOW(), NOW()),
('jane.smith@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane Smith', 'https://i.pravatar.cc/150?img=5', 'EMAIL', NOW(), NOW()),
('bob.wilson@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Bob Wilson', 'https://i.pravatar.cc/150?img=13', 'EMAIL', NOW(), NOW()),
('alice.johnson@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Alice Johnson', 'https://i.pravatar.cc/150?img=9', 'EMAIL', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Assign roles to users
INSERT INTO user_roles (user_id, roles)
SELECT id, 'ROLE_ADMIN' FROM users WHERE email = 'admin@dkarito.com'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, roles)
SELECT id, 'ROLE_USER' FROM users WHERE email IN ('john.doe@example.com', 'jane.smith@example.com', 'bob.wilson@example.com', 'alice.johnson@example.com')
ON CONFLICT DO NOTHING;

-- ===== PRODUCTS =====
INSERT INTO products (title, description, price, img, created_at, updated_at) VALUES
('Wireless Bluetooth Headphones', 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and superior sound quality', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', NOW(), NOW()),
('Smart Fitness Watch', 'Advanced fitness tracker with heart rate monitor, GPS, sleep tracking, and smartphone notifications', 299.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', NOW(), NOW()),
('Ergonomic Laptop Stand', 'Adjustable aluminum laptop stand with ventilation design for improved posture and cooling', 49.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', NOW(), NOW()),
('Stainless Steel Water Bottle', 'Insulated 32oz water bottle that keeps drinks cold for 24 hours or hot for 12 hours', 34.99, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', NOW(), NOW()),
('Mechanical Keyboard RGB', 'Premium mechanical keyboard with customizable RGB backlighting and tactile switches', 149.99, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', NOW(), NOW()),
('Wireless Mouse Rechargeable', 'Ergonomic wireless mouse with precision tracking and rechargeable battery', 39.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', NOW(), NOW()),
('Portable Power Bank 20000mAh', 'High-capacity power bank with fast charging support and dual USB ports', 59.99, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500', NOW(), NOW()),
('HD Webcam 1080p', 'Professional webcam with auto-focus, noise reduction microphone, and wide-angle lens', 79.99, 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500', NOW(), NOW()),
('USB-C Docking Station', 'Multi-port USB-C hub with HDMI, USB 3.0, Ethernet, and charging capabilities', 89.99, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500', NOW(), NOW()),
('Noise Cancelling Earbuds', 'True wireless earbuds with active noise cancellation and premium sound quality', 179.99, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500', NOW(), NOW()),
('Laptop Backpack Anti-Theft', 'Water-resistant laptop backpack with USB charging port and anti-theft design', 65.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', NOW(), NOW()),
('LED Desk Lamp Smart', 'Adjustable LED desk lamp with touch control, multiple brightness levels, and USB port', 44.99, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500', NOW(), NOW()),
('Yoga Mat Premium', 'Extra-thick yoga mat with non-slip surface and carrying strap', 39.99, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', NOW(), NOW()),
('Coffee Maker Programmable', 'Automatic drip coffee maker with programmable timer and thermal carafe', 69.99, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', NOW(), NOW()),
('Air Purifier HEPA Filter', 'Compact air purifier with true HEPA filter for removing allergens and pollutants', 129.99, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ===== INVENTORY =====
INSERT INTO inventory (product_id, quantity, location, last_updated)
SELECT id, 
    CASE 
        WHEN price < 50 THEN 200
        WHEN price < 100 THEN 100
        WHEN price < 200 THEN 50
        ELSE 30
    END,
    'Main Warehouse',
    NOW()
FROM products
ON CONFLICT DO NOTHING;

-- ===== ORDERS =====
-- Order 1: John Doe - Completed
INSERT INTO orders (user_id, order_date, total_amount, status, shipping_address, payment_status, created_at, updated_at)
SELECT 
    id,
    NOW() - INTERVAL '7 days',
    649.97,
    'COMPLETED',
    '123 Main St, New York, NY 10001',
    'COMPLETED',
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '6 days'
FROM users WHERE email = 'john.doe@example.com';

-- Order 2: Jane Smith - Pending
INSERT INTO orders (user_id, order_date, total_amount, status, shipping_address, payment_status, created_at, updated_at)
SELECT 
    id,
    NOW() - INTERVAL '2 days',
    284.97,
    'PENDING',
    '456 Oak Ave, Los Angeles, CA 90001',
    'PENDING',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
FROM users WHERE email = 'jane.smith@example.com';

-- Order 3: Bob Wilson - Shipped
INSERT INTO orders (user_id, order_date, total_amount, status, shipping_address, payment_status, created_at, updated_at)
SELECT 
    id,
    NOW() - INTERVAL '4 days',
    429.97,
    'SHIPPED',
    '789 Pine Rd, Chicago, IL 60601',
    'COMPLETED',
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '3 days'
FROM users WHERE email = 'bob.wilson@example.com';

-- Order 4: Alice Johnson - Completed
INSERT INTO orders (user_id, order_date, total_amount, status, shipping_address, payment_status, created_at, updated_at)
SELECT 
    id,
    NOW() - INTERVAL '10 days',
    199.98,
    'COMPLETED',
    '321 Elm St, Houston, TX 77001',
    'COMPLETED',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '9 days'
FROM users WHERE email = 'alice.johnson@example.com';

-- ===== ORDER ITEMS =====
-- Order 1 items (John Doe)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
SELECT 
    o.id,
    p.id,
    1,
    p.price,
    p.price
FROM orders o
CROSS JOIN products p
WHERE o.total_amount = 649.97
AND p.title IN ('Wireless Bluetooth Headphones', 'Smart Fitness Watch', 'Mechanical Keyboard RGB');

-- Order 2 items (Jane Smith)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
SELECT 
    o.id,
    p.id,
    CASE WHEN p.title = 'Stainless Steel Water Bottle' THEN 2 ELSE 1 END,
    p.price,
    CASE WHEN p.title = 'Stainless Steel Water Bottle' THEN p.price * 2 ELSE p.price END
FROM orders o
CROSS JOIN products p
WHERE o.total_amount = 284.97
AND p.title IN ('Noise Cancelling Earbuds', 'Laptop Backpack Anti-Theft', 'Stainless Steel Water Bottle');

-- Order 3 items (Bob Wilson)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
SELECT 
    o.id,
    p.id,
    1,
    p.price,
    p.price
FROM orders o
CROSS JOIN products p
WHERE o.total_amount = 429.97
AND p.title IN ('Smart Fitness Watch', 'Air Purifier HEPA Filter');

-- Order 4 items (Alice Johnson)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
SELECT 
    o.id,
    p.id,
    CASE WHEN p.title = 'Ergonomic Laptop Stand' THEN 2 ELSE 1 END,
    p.price,
    CASE WHEN p.title = 'Ergonomic Laptop Stand' THEN p.price * 2 ELSE p.price END
FROM orders o
CROSS JOIN products p
WHERE o.total_amount = 199.98
AND p.title IN ('Ergonomic Laptop Stand', 'Yoga Mat Premium', 'Portable Power Bank 20000mAh');

-- ===== PAYMENTS =====
-- Payment for Order 1 (Completed)
INSERT INTO payments (order_id, amount, payment_method, payment_status, transaction_id, payment_date, created_at, updated_at)
SELECT 
    id,
    total_amount,
    'CREDIT_CARD',
    'COMPLETED',
    'TXN-' || LPAD(id::text, 10, '0'),
    order_date + INTERVAL '5 minutes',
    order_date + INTERVAL '5 minutes',
    order_date + INTERVAL '5 minutes'
FROM orders WHERE total_amount = 649.97;

-- Payment for Order 2 (Pending)
INSERT INTO payments (order_id, amount, payment_method, payment_status, transaction_id, payment_date, created_at, updated_at)
SELECT 
    id,
    total_amount,
    'PAYPAL',
    'PENDING',
    'TXN-' || LPAD(id::text, 10, '0'),
    order_date,
    order_date,
    order_date
FROM orders WHERE total_amount = 284.97;

-- Payment for Order 3 (Completed)
INSERT INTO payments (order_id, amount, payment_method, payment_status, transaction_id, payment_date, created_at, updated_at)
SELECT 
    id,
    total_amount,
    'DEBIT_CARD',
    'COMPLETED',
    'TXN-' || LPAD(id::text, 10, '0'),
    order_date + INTERVAL '2 minutes',
    order_date + INTERVAL '2 minutes',
    order_date + INTERVAL '2 minutes'
FROM orders WHERE total_amount = 429.97;

-- Payment for Order 4 (Completed)
INSERT INTO payments (order_id, amount, payment_method, payment_status, transaction_id, payment_date, created_at, updated_at)
SELECT 
    id,
    total_amount,
    'CREDIT_CARD',
    'COMPLETED',
    'TXN-' || LPAD(id::text, 10, '0'),
    order_date + INTERVAL '3 minutes',
    order_date + INTERVAL '3 minutes',
    order_date + INTERVAL '3 minutes'
FROM orders WHERE total_amount = 199.98;

-- Summary report
SELECT 'Test Data Loading Complete!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_inventory_items FROM inventory;
SELECT COUNT(*) as total_orders FROM orders;
SELECT COUNT(*) as total_order_items FROM order_items;
SELECT COUNT(*) as total_payments FROM payments;
