const express = require('express');
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Track visitor
router.post('/track', async (req, res) => {
  try {
    const {
      ip_address,
      user_agent,
      referrer,
      landing_page
    } = req.body;

    const session_id = uuidv4();
    
    // Simple device detection
    const device_type = user_agent && user_agent.includes('Mobile') ? 'mobile' : 
                       user_agent && user_agent.includes('Tablet') ? 'tablet' : 'desktop';

    await pool.execute(`
      INSERT INTO edu_visitors (ip_address, user_agent, referrer, landing_page, session_id, device_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [ip_address, user_agent, referrer, landing_page, session_id, device_type]);

    res.json({ 
      success: true, 
      message: 'Visit tracked successfully',
      session_id 
    });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    res.status(500).json({ 
      error: 'Failed to track visit',
      message: error.message 
    });
  }
});

// Get visitor stats
router.get('/stats', async (req, res) => {
  try {
    const [totalVisits] = await pool.execute(`
      SELECT COUNT(*) as total FROM edu_visitors
    `);

    const [uniqueVisitors] = await pool.execute(`
      SELECT COUNT(DISTINCT ip_address) as unique_count FROM edu_visitors
    `);

    const [todayVisits] = await pool.execute(`
      SELECT COUNT(*) as today_count FROM edu_visitors 
      WHERE DATE(visit_timestamp) = CURDATE()
    `);

    res.json({
      total_visits: totalVisits[0].total,
      unique_visitors: uniqueVisitors[0].unique_count,
      today_visits: todayVisits[0].today_count
    });
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    res.status(500).json({ 
      error: 'Failed to get visitor stats',
      message: error.message 
    });
  }
});

module.exports = router;
