-- Complete Database Setup for EnglishMaster Pro
-- Run this on TiDB Cloud SQL Console for database "Eng"

-- 1. Create visitors table
CREATE TABLE IF NOT EXISTS edu_visitors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  referrer VARCHAR(500),
  landing_page VARCHAR(500),
  country VARCHAR(100),
  city VARCHAR(100),
  device_type ENUM('desktop', 'mobile', 'tablet') DEFAULT 'desktop',
  browser VARCHAR(100),
  os VARCHAR(100),
  first_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_visit DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  page_views INT DEFAULT 1,
  session_duration INT DEFAULT 0,
  is_returning BOOLEAN DEFAULT false,
  INDEX idx_session_id (session_id),
  INDEX idx_first_visit (first_visit),
  INDEX idx_country (country)
);

-- 2. Create leads table
CREATE TABLE IF NOT EXISTS edu_leads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  lead_id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  course_interest VARCHAR(100),
  message TEXT,
  lead_source VARCHAR(100) DEFAULT 'website',
  lead_status ENUM('new', 'contacted', 'qualified', 'converted', 'lost') DEFAULT 'new',
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_lead_id (lead_id),
  INDEX idx_email (email),
  INDEX idx_lead_status (lead_status),
  INDEX idx_course_interest (course_interest),
  INDEX idx_created_at (created_at)
);

-- 3. Create orders table
CREATE TABLE IF NOT EXISTS edu_orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_number VARCHAR(100) UNIQUE NOT NULL,
  lead_id VARCHAR(100),
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  course_name VARCHAR(200) NOT NULL,
  plan_type ENUM('basic', 'premium', 'enterprise') NOT NULL,
  original_price DECIMAL(10,2) NOT NULL,
  discount_percent INT DEFAULT 0,
  final_price DECIMAL(10,2) NOT NULL,
  payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_method VARCHAR(50),
  transaction_id VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_number (order_number),
  INDEX idx_payment_status (payment_status),
  INDEX idx_created_at (created_at)
);

-- 4. Create admin_users table
CREATE TABLE IF NOT EXISTS edu_admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(150),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager') DEFAULT 'admin',
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  INDEX idx_username (username)
);

-- 5. Create analytics_daily table
CREATE TABLE IF NOT EXISTS edu_analytics_daily (
  id INT PRIMARY KEY AUTO_INCREMENT,
  date DATE UNIQUE NOT NULL,
  total_visitors INT DEFAULT 0,
  unique_visitors INT DEFAULT 0,
  total_leads INT DEFAULT 0,
  total_orders INT DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  avg_order_value DECIMAL(10,2) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date (date)
);

-- 6. Insert default admin user
INSERT IGNORE INTO edu_admin_users (
    id, 
    username, 
    email, 
    password_hash, 
    role, 
    is_active, 
    created_at
) VALUES (
    1,
    'admin',
    'admin@eduplatform.com',
    '$2a$10$GZls0SLYQbb1trAV6it3t.ygQFjwoEXqDnjRVilLffrPC8LcLhXAm',
    'admin',
    1,
    NOW()
);

-- 7. Verify tables were created
SHOW TABLES;

-- 8. Verify admin user was created
SELECT id, username, email, role, is_active, created_at 
FROM edu_admin_users 
WHERE email = 'admin@eduplatform.com';

-- 9. Insert sample analytics data
INSERT IGNORE INTO edu_analytics_daily (date, total_visitors, unique_visitors, total_leads, total_orders, total_revenue, conversion_rate, avg_order_value) VALUES
('2025-08-25', 120, 85, 12, 3, 7500000, 2.50, 2500000),
('2025-08-26', 145, 98, 18, 5, 12500000, 3.45, 2500000),
('2025-08-27', 98, 67, 8, 2, 5000000, 2.04, 2500000);

-- Admin Login Credentials:
-- Email: admin@eduplatform.com
-- Password: admin123456
