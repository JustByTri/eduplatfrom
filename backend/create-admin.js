const { pool } = require('./config/database');
const bcrypt = require('bcryptjs');

const createNewAdmin = async () => {
  try {
    console.log('🔄 Creating new admin user...');
    
    // Delete old admin if exists
    await pool.execute(`DELETE FROM edu_admin_users WHERE email IN ('admin@eduplatform.com', 'admin@englishmaster.pro')`);
    
    // Create new admin with simple credentials
    const hashedPassword = await bcrypt.hash('admin123456', 10);
    
    const [result] = await pool.execute(`
      INSERT INTO edu_admin_users (username, email, password_hash, role, is_active) 
      VALUES (?, ?, ?, ?, ?)
    `, [
      'admin',
      'admin@eduplatform.com', 
      hashedPassword,
      'admin',
      true
    ]);
    
    console.log('✅ New admin created with ID:', result.insertId);
    console.log('📧 Email: admin@eduplatform.com');
    console.log('🔑 Password: admin123456');
    console.log('👤 Username: admin');
    
    // Verify it works
    const [verify] = await pool.execute(`
      SELECT id, username, email, role, is_active 
      FROM edu_admin_users 
      WHERE email = ?
    `, ['admin@eduplatform.com']);
    
    console.log('✅ Verification:', verify[0]);
    
    // Test password
    const passwordTest = await bcrypt.compare('admin123456', hashedPassword);
    console.log('🔐 Password test:', passwordTest ? 'VALID' : 'INVALID');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
};

createNewAdmin();
