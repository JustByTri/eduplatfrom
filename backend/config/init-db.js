const { pool } = require('../config/database');

const createTables = async () => {
  try {
    console.log('🔄 Creating database tables...');

    // Create visitors table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS edu_visitors (
        id INT PRIMARY KEY AUTO_INCREMENT,
        ip_address VARCHAR(45),
        user_agent TEXT,
        referrer VARCHAR(500),
        landing_page VARCHAR(200),
        visit_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        session_id VARCHAR(100),
        country VARCHAR(50) DEFAULT NULL,
        device_type ENUM('desktop', 'mobile', 'tablet') DEFAULT 'desktop',
        INDEX idx_ip_address (ip_address),
        INDEX idx_visit_timestamp (visit_timestamp)
      )
    `);

    // Create leads table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS edu_leads (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(20),
        selected_plan ENUM('basic', 'premium', 'enterprise') NOT NULL,
        source VARCHAR(100) DEFAULT 'landing_page',
        status ENUM('new', 'contacted', 'converted', 'lost') DEFAULT 'new',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        notes TEXT,
        ip_address VARCHAR(45),
        INDEX idx_email (email),
        INDEX idx_created_at (created_at),
        INDEX idx_status (status)
      )
    `);

    // Create orders table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS edu_orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        lead_id INT,
        order_number VARCHAR(50) UNIQUE NOT NULL,
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
      )
    `);

    // Create admin_users table
    await pool.execute(`
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
      )
    `);

    // Create analytics_daily table
    await pool.execute(`
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
      )
    `);

    console.log('✅ All tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    throw error;
  }
};

const seedAdminUser = async () => {
  try {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123456', 10);
    
    await pool.execute(`
      INSERT IGNORE INTO edu_admin_users (username, email, password_hash, role) 
      VALUES (?, ?, ?, ?)
    `, [
      process.env.ADMIN_USERNAME || 'admin',
      'admin@eduplatform.com',
      hashedPassword,
      'admin'
    ]);

    console.log('✅ Default admin user created');
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

module.exports = {
  createTables,
  seedAdminUser
};
