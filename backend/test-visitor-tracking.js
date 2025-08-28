const { pool } = require('./config/database');

const testVisitorTracking = async () => {
  try {
    console.log('🔍 Testing visitor tracking...');
    
    // Check current visitor count
    const [beforeCount] = await pool.execute('SELECT COUNT(*) as count FROM edu_visitors');
    console.log(`📊 Visitors before: ${beforeCount[0].count}`);
    
    // Simulate a visitor tracking
    await pool.execute(`
      INSERT INTO edu_visitors (ip_address, user_agent, referrer, landing_page, session_id, device_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      '203.113.174.123', // Random IP
      'Mozilla/5.0 (Test Browser)',
      'https://google.com/search?q=english+course', 
      '/',
      `session-${Date.now()}`,
      'desktop'
    ]);
    

    const [afterCount] = await pool.execute('SELECT COUNT(*) as count FROM edu_visitors');
    console.log(`📊 Visitors after: ${afterCount[0].count}`);
    
   
    const [recentVisitors] = await pool.execute(`
      SELECT ip_address, referrer, landing_page, visit_timestamp 
      FROM edu_visitors 
      ORDER BY visit_timestamp DESC 
      LIMIT 5
    `);
    
    console.log('👥 Recent Visitors:');
    recentVisitors.forEach((visitor, index) => {
      console.log(`${index + 1}. IP: ${visitor.ip_address}, From: ${visitor.referrer}, Time: ${visitor.visit_timestamp}`);
    });
    
    console.log('✅ Visitor tracking test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
};

testVisitorTracking();
