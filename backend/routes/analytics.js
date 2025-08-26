const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// Get analytics summary
router.get('/summary', async (req, res) => {
  try {
    const { period = '7' } = req.query; // days
    
    // Get visitor analytics
    const [visitorAnalytics] = await pool.execute(`
      SELECT 
        DATE(visit_timestamp) as date,
        COUNT(*) as visits,
        COUNT(DISTINCT ip_address) as unique_visitors
      FROM edu_visitors 
      WHERE visit_timestamp >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(visit_timestamp)
      ORDER BY date DESC
    `, [parseInt(period)]);

    // Get lead analytics
    const [leadAnalytics] = await pool.execute(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as edu_leads,
        COUNT(CASE WHEN status = 'converted' THEN 1 END) as conversions
      FROM edu_leads 
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, [parseInt(period)]);

    // Get revenue analytics
    const [revenueAnalytics] = await pool.execute(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as edu_orders,
        COALESCE(SUM(CASE WHEN payment_status = 'completed' THEN final_price END), 0) as revenue
      FROM edu_orders 
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, [parseInt(period)]);

    // Merge data by date
    const analytics = [];
    const dateMap = new Map();

    // Initialize with visitor data
    visitorAnalytics.forEach(item => {
      const dateKey = item.date.toISOString().split('T')[0];
      dateMap.set(dateKey, {
        date: dateKey,
        visits: item.visits,
        unique_visitors: item.unique_visitors,
        edu_leads: 0,
        conversions: 0,
        edu_orders: 0,
        revenue: 0
      });
    });

    // Add lead data
    leadAnalytics.forEach(item => {
      const dateKey = item.date.toISOString().split('T')[0];
      if (dateMap.has(dateKey)) {
        const existing = dateMap.get(dateKey);
        existing.leads = item.leads;
        existing.conversions = item.conversions;
      }
    });

    // Add revenue data
    revenueAnalytics.forEach(item => {
      const dateKey = item.date.toISOString().split('T')[0];
      if (dateMap.has(dateKey)) {
        const existing = dateMap.get(dateKey);
        existing.orders = item.orders;
        existing.revenue = parseFloat(item.revenue);
      }
    });

    // Convert map to array and calculate rates
    const analyticsData = Array.from(dateMap.values()).map(item => ({
      ...item,
      conversion_rate: item.visits > 0 ? ((item.leads / item.visits) * 100).toFixed(2) : 0,
      avg_order_value: item.orders > 0 ? (item.revenue / item.orders).toFixed(2) : 0
    }));

    res.json({
      period: parseInt(period),
      analytics: analyticsData.reverse() // Newest first
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    res.status(500).json({
      error: 'Failed to get analytics summary',
      message: error.message
    });
  }
});

// Get device and traffic source analytics
router.get('/traffic-sources', async (req, res) => {
  try {
    // Device breakdown
    const [deviceStats] = await pool.execute(`
      SELECT device_type, COUNT(*) as count
      FROM edu_visitors
      GROUP BY device_type
    `);

    // Referrer breakdown
    const [referrerStats] = await pool.execute(`
      SELECT 
        CASE 
          WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
          WHEN referrer LIKE '%google%' THEN 'Google'
          WHEN referrer LIKE '%facebook%' THEN 'Facebook'
          WHEN referrer LIKE '%youtube%' THEN 'YouTube'
          ELSE 'Other'
        END as source,
        COUNT(*) as count
      FROM edu_visitors
      GROUP BY source
    `);

    // Landing page stats
    const [landingPageStats] = await pool.execute(`
      SELECT landing_page, COUNT(*) as count
      FROM edu_visitors
      WHERE landing_page IS NOT NULL
      GROUP BY landing_page
      ORDER BY count DESC
      LIMIT 10
    `);

    res.json({
      devices: deviceStats,
      traffic_sources: referrerStats,
      landing_pages: landingPageStats
    });
  } catch (error) {
    console.error('Traffic sources error:', error);
    res.status(500).json({
      error: 'Failed to get traffic source analytics',
      message: error.message
    });
  }
});

// Update daily analytics (can be called by cron job)
router.post('/update-daily', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get today's stats
    const [visitorStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_visitors,
        COUNT(DISTINCT ip_address) as unique_visitors
      FROM edu_visitors 
      WHERE DATE(visit_timestamp) = ?
    `, [today]);

    const [leadStats] = await pool.execute(`
      SELECT COUNT(*) as total_leads 
      FROM edu_leads 
      WHERE DATE(created_at) = ?
    `, [today]);

    const [orderStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(final_price), 0) as total_revenue
      FROM edu_orders 
      WHERE DATE(created_at) = ? AND payment_status = 'completed'
    `, [today]);

    const totalVisitors = visitorStats[0].total_visitors;
    const totalLeads = leadStats[0].total_leads;
    const totalOrders = orderStats[0].total_orders;
    const totalRevenue = parseFloat(orderStats[0].total_revenue);

    const conversionRate = totalVisitors > 0 ? (totalLeads / totalVisitors) * 100 : 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Insert or update daily analytics
    await pool.execute(`
      INSERT INTO edu_analytics_daily 
      (date, total_visitors, unique_visitors, total_leads, total_orders, total_revenue, conversion_rate, avg_order_value)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      total_visitors = VALUES(total_visitors),
      unique_visitors = VALUES(unique_visitors),
      total_leads = VALUES(total_leads),
      total_orders = VALUES(total_orders),
      total_revenue = VALUES(total_revenue),
      conversion_rate = VALUES(conversion_rate),
      avg_order_value = VALUES(avg_order_value)
    `, [
      today,
      totalVisitors,
      visitorStats[0].unique_visitors,
      totalLeads,
      totalOrders,
      totalRevenue,
      conversionRate,
      avgOrderValue
    ]);

    res.json({
      success: true,
      message: 'Daily analytics updated',
      data: {
        date: today,
        total_visitors: totalVisitors,
        unique_visitors: visitorStats[0].unique_visitors,
        total_leads: totalLeads,
        total_orders: totalOrders,
        total_revenue: totalRevenue,
        conversion_rate: conversionRate.toFixed(2),
        avg_order_value: avgOrderValue.toFixed(2)
      }
    });
  } catch (error) {
    console.error('Update daily analytics error:', error);
    res.status(500).json({
      error: 'Failed to update daily analytics',
      message: error.message
    });
  }
});

module.exports = router;
