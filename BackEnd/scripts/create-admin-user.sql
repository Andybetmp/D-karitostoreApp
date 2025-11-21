-- Script para crear usuario ADMIN en D-karitostoreApp
-- Base de datos: dkarito
-- Fecha: 2025-11-21

-- 1. Insertar usuario ADMIN
-- Password: Admin123! (hasheado con BCrypt)
INSERT INTO users (email, password, name, provider, created_at, updated_at)
VALUES (
    'admin@dkarito.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', -- Password: Admin123!
    'Admin User',
    'EMAIL',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;

-- 2. Obtener el ID del usuario recién creado
DO $$
DECLARE
    user_id_var BIGINT;
BEGIN
    SELECT id INTO user_id_var FROM users WHERE email = 'admin@dkarito.com';
    
    -- 3. Asignar rol ADMIN
    INSERT INTO user_roles (user_id, roles)
    VALUES (user_id_var, 'ADMIN')
    ON CONFLICT DO NOTHING;
    
    -- 4. También agregar rol USER (opcional)
    INSERT INTO user_roles (user_id, roles)
    VALUES (user_id_var, 'USER')
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Usuario ADMIN creado exitosamente con ID: %', user_id_var;
END $$;

-- 5. Verificar que el usuario fue creado correctamente
SELECT 
    u.id,
    u.email,
    u.name,
    u.provider,
    ur.roles,
    u.created_at
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'admin@dkarito.com';
