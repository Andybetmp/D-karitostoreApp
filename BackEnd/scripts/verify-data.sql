-- Quick verification query to check test data
-- Run this to see if data exists in all tables

SELECT 'Users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'User Roles', COUNT(*) FROM user_roles
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Inventory', COUNT(*) FROM inventory
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Order Items', COUNT(*) FROM order_items
UNION ALL
SELECT 'Payments', COUNT(*) FROM payments;

-- View sample data from each table
SELECT 'Sample Users:' as info;
SELECT id, email, name FROM users LIMIT 5;

SELECT 'Sample Products:' as info;
SELECT id, title, price FROM products LIMIT 5;

SELECT 'Sample Orders:' as info;
SELECT id, user_id, total_amount, status FROM orders LIMIT 5;
