-- D'Karito Store Test Data - VERSIÓN CORREGIDA
-- Para esquema con columna username

-- Primero, limpiemos los datos existentes
DELETE FROM payments WHERE order_id IN (SELECT id FROM orders);
DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders);
DELETE FROM orders;
DELETE FROM inventory;
DELETE FROM products;
DELETE FROM user_roles;
DELETE FROM users;

-- ===== USUARIOS CON USERNAME =====
-- Contraseña para todos: "password123" (hash BCrypt válido)
INSERT INTO users (username, email, password, first_name, last_name, role, enabled, created_at, updated_at, name, picture, provider) VALUES
('admin', 'admin@dkarito.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'User', 'ADMIN', true, NOW(), NOW(), 'Admin User', 'https://i.pravatar.cc/150?img=1', 'EMAIL'),
('johndoe', 'john.doe@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John', 'Doe', 'USER', true, NOW(), NOW(), 'John Doe', 'https://i.pravatar.cc/150?img=12', 'EMAIL'),
('janesmith', 'jane.smith@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane', 'Smith', 'USER', true, NOW(), NOW(), 'Jane Smith', 'https://i.pravatar.cc/150?img=5', 'EMAIL'),
('bobwilson', 'bob.wilson@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Bob', 'Wilson', 'USER', true, NOW(), NOW(), 'Bob Wilson', 'https://i.pravatar.cc/150?img=13', 'EMAIL'),
('alicejohnson', 'alice.johnson@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Alice', 'Johnson', 'USER', true, NOW(), NOW(), 'Alice Johnson', 'https://i.pravatar.cc/150?img=9', 'EMAIL')
ON CONFLICT (email) DO NOTHING;

-- Roles de usuarios (sin prefijo ROLE_)
INSERT INTO user_roles (user_id, roles)
SELECT id, 'ADMIN' FROM users WHERE email = 'admin@dkarito.com'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, roles)
SELECT id, 'USER' FROM users WHERE email IN ('john.doe@example.com', 'jane.smith@example.com', 'bob.wilson@example.com', 'alice.johnson@example.com')
ON CONFLICT DO NOTHING;

-- ===== PRODUCTOS =====
INSERT INTO products (name, description, price, category, brand, stock_quantity, img, created_at, updated_at, title) VALUES
('Wireless Headphones', 'Premium over-ear headphones with active noise cancellation', 199.99, 'Electronics', 'AudioTech', 50, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', NOW(), NOW(), 'Wireless Bluetooth Headphones'),
('Smart Watch', 'Advanced fitness tracker with heart rate monitor and GPS', 299.99, 'Electronics', 'FitTech', 30, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', NOW(), NOW(), 'Smart Fitness Watch'),
('Laptop Stand', 'Adjustable aluminum laptop stand for better ergonomics', 49.99, 'Accessories', 'OfficePro', 100, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', NOW(), NOW(), 'Ergonomic Laptop Stand'),
('Water Bottle', 'Insulated 32oz water bottle keeps drinks cold for 24 hours', 34.99, 'Kitchen', 'HomeEssentials', 200, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', NOW(), NOW(), 'Stainless Steel Water Bottle'),
('Mechanical Keyboard', 'Premium mechanical keyboard with RGB backlighting', 149.99, 'Accessories', 'TechPro', 75, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', NOW(), NOW(), 'Mechanical Keyboard RGB')
ON CONFLICT DO NOTHING;

-- ===== INVENTARIO =====
INSERT INTO inventory (product_id, quantity, location, last_updated)
SELECT id, stock_quantity, 'Main Warehouse', NOW()
FROM products
ON CONFLICT DO NOTHING;

-- Resumen
SELECT 'Datos de prueba cargados exitosamente' as status;
SELECT COUNT(*) as total_usuarios FROM users;
SELECT COUNT(*) as total_productos FROM products;
SELECT COUNT(*) as total_inventario FROM inventory;
