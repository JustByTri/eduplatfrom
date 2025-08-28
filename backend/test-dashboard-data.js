const { pool } = require('./config/database');

const checkDashboardData = async () => {
  try {
    console.log('🔍 Checking Dashboard Data from Database...\n');
    
    // Visitors stats
    const [visitors] = await pool.execute(`
      SELECT 
        COUNT(*) as total_visits,
        COUNT(DISTINCT ip_address) as unique_visitors,
        COUNT(CASE WHEN DATE(visit_timestamp) = CURDATE() THEN 1 END) as today_visits
      FROM edu_visitors
    `);
    
    console.log('👥 VISITOR STATS:');
    console.log(`   Total Visits: ${visitors[0].total_visits}`);
    console.log(`   Unique Visitors: ${visitors[0].unique_visitors}`);
    console.log(`   Today's Visits: ${visitors[0].today_visits}\n`);
    
    
    const [leads] = await pool.execute(`
      SELECT 
        COUNT(*) as total_leads,
        COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as today_leads,
        COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted_leads
      FROM edu_leads
    `);
    
    console.log('🎯 LEAD STATS:');
    console.log(`   Total Leads: ${leads[0].total_leads}`);
    console.log(`   Today's Leads: ${leads[0].today_leads}`);
    console.log(`   Converted: ${leads[0].converted_leads}\n`);
    
    // Orders stats
    const [orders] = await pool.execute(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) as completed_orders,
        COALESCE(SUM(CASE WHEN payment_status = 'completed' THEN final_price END), 0) as total_revenue
      FROM edu_orders
    `);
    
    console.log('💰 ORDER STATS:');
    console.log(`   Total Orders: ${orders[0].total_orders}`);
    console.log(`   Completed: ${orders[0].completed_orders}`);
    console.log(`   Revenue: ${new Intl.NumberFormat('vi-VN').format(orders[0].total_revenue)} VNĐ\n`);
    
    // Plan distribution
    const [planDist] = await pool.execute(`
      SELECT selected_plan, COUNT(*) as count 
      FROM edu_leads 
      GROUP BY selected_plan
    `);
    
    console.log('📊 PLAN DISTRIBUTION:');
    planDist.forEach(plan => {
      console.log(`   ${plan.selected_plan}: ${plan.count} leads`);
    });
    
    // Recent visitors by referrer
    const [referrers] = await pool.execute(`
      SELECT referrer, COUNT(*) as count
      FROM edu_visitors 
      WHERE referrer IS NOT NULL 
      GROUP BY referrer 
      ORDER BY count DESC
    `);
    
    console.log('\n🔗 TOP REFERRERS:');
    referrers.forEach(ref => {
      console.log(`   ${ref.referrer}: ${ref.count} visits`);
    });
    
    // Conversion rate calculation
    const conversionRate = visitors[0].total_visits > 0 ? 
      (leads[0].total_leads / visitors[0].total_visits * 100).toFixed(2) : 0;
    
    console.log(`\n📈 CONVERSION RATE: ${conversionRate}%`);
    console.log(`   Formula: ${leads[0].total_leads} leads ÷ ${visitors[0].total_visits} visits\n`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
};

checkDashboardData();
