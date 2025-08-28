const { pool } = require('./config/database');

const testDashboard = async () => {
  try {
    console.log('🔍 Testing dashboard data...');
    
    // Test leads query 
    const [leads] = await pool.execute(`
      SELECT name, email, phone, selected_plan, created_at, source, status 
      FROM edu_leads 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    console.log('📊 Leads found:', leads.length);
    console.log('📋 Leads data:', JSON.stringify(leads, null, 2));
    
    // Test full dashboard API response
    console.log('\n🔍 Testing full dashboard endpoint...');
    const response = await fetch('https://eduplatfrom-2.onrender.com/api/admin/dashboard', {
      headers: {
        'Authorization': `Bearer test-token` // Mock token for testing
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('📊 Dashboard API response:');
      console.log('- edu_visitors:', data.edu_visitors);
      console.log('- edu_leads count:', data.edu_leads?.length || 0);
      console.log('- First 2 leads:', data.edu_leads?.slice(0, 2) || []);
    } else {
      console.log('❌ Dashboard API failed:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
};

testDashboard();
