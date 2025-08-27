-- Admin User Setup for Production
-- Run this on TiDB Cloud SQL Console

-- Insert default admin user
INSERT IGNORE INTO admin_users (
    id, 
    username, 
    email, 
    password_hash, 
    role, 
    is_active, 
    created_at, 
    updated_at
) VALUES (
    1,
    'admin',
    'admin@eduplatform.com',
    '$2a$10$GZls0SLYQbb1trAV6it3t.ygQFjwoEXqDnjRVilLffrPC8LcLhXAm',
    'super_admin',
    1,
    NOW(),
    NOW()
);

-- Verify admin user was created
SELECT id, username, email, role, is_active, created_at 
FROM admin_users 
WHERE email = 'admin@eduplatform.com';

-- Test Credentials:
-- Email: admin@eduplatform.com
-- Password: admin123456
