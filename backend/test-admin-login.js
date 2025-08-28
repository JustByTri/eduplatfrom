const { pool } = require('./config/database');
const bcrypt = require('bcryptjs');

const verifyAdminLogin = async () => {
  try {
    console.log('🔍 Checking admin credentials in database...\n');
    
    // Get admin user data
    const [admins] = await pool.execute(`
      SELECT id, username, email, password_hash, role, is_active, created_at
      FROM edu_admin_users
      WHERE is_active = true
    `);
    
    console.log(`📊 Found ${admins.length} active admin users:`);
    
    for (const admin of admins) {
      console.log(`\n👤 Admin ID: ${admin.id}`);
      console.log(`   Username: ${admin.username}`);  
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Created: ${admin.created_at}`);
      console.log(`   Password Hash: ${admin.password_hash ? 'EXISTS' : 'MISSING'}`);
      
      // Test password
      const testPasswords = ['admin123456', 'admin123', 'admin'];
      
      for (const testPassword of testPasswords) {
        try {
          const isValid = await bcrypt.compare(testPassword, admin.password_hash);
          if (isValid) {
            console.log(`   ✅ Password '${testPassword}' is VALID`);
          } else {
            console.log(`   ❌ Password '${testPassword}' is invalid`);
          }
        } catch (error) {
          console.log(`   ⚠️  Error testing password '${testPassword}': ${error.message}`);
        }
      }
    }
    
    // Test the exact login flow
    console.log('\n🧪 Testing login flow...');
    
    const testEmail = 'admin@eduplatform.com';
    const testPassword = 'admin123456';
    
    const [loginTest] = await pool.execute(`
      SELECT id, username, email, password_hash, role, is_active
      FROM edu_admin_users 
      WHERE (username = ? OR email = ?) AND is_active = true
    `, [testEmail, testEmail]);
    
    if (loginTest.length === 0) {
      console.log('❌ No admin found with email:', testEmail);
    } else {
      console.log(`✅ Found admin for login test:`, {
        id: loginTest[0].id,
        username: loginTest[0].username,
        email: loginTest[0].email
      });
      
      const passwordMatch = await bcrypt.compare(testPassword, loginTest[0].password_hash);
      console.log(`Password verification: ${passwordMatch ? '✅ SUCCESS' : '❌ FAILED'}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
};

verifyAdminLogin();
