const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const router = express.Router();

// Middleware to verify admin token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if admin still exists and is active
    const [admin] = await pool.execute(`
      SELECT id, username, role, is_active FROM edu_admin_users 
      WHERE id = ? AND is_active = true
    `, [decoded.id]);

    if (admin.length === 0) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.admin = admin[0];
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required'
      });
    }

    // Find admin user
    const [admins] = await pool.execute(`
      SELECT id, username, email, password_hash, role, is_active
      FROM edu_admin_users 
      WHERE username = ? AND is_active = true
    `, [username]);

    if (admins.length === 0) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    const admin = admins[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Update last login
    await pool.execute(`
      UPDATE edu_admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?
    `, [admin.id]);

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
});

// Verify token endpoint
router.get('/verify', verifyToken, (req, res) => {
  res.json({
    success: true,
    admin: req.admin
  });
});

// Get admin dashboard data
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    // Get visitor stats
    const [visitorStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_visits,
        COUNT(DISTINCT ip_address) as unique_visitors,
        COUNT(CASE WHEN DATE(visit_timestamp) = CURDATE() THEN 1 END) as today_visits
      FROM edu_visitors
    `);

    // Get lead stats
    const [leadStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_leads,
        COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as today_leads,
        COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted_leads
      FROM edu_leads
    `);

    // Get order stats
    const [orderStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) as completed_orders,
        COALESCE(SUM(CASE WHEN payment_status = 'completed' THEN final_price END), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN payment_status = 'completed' AND DATE(created_at) = CURDATE() THEN final_price END), 0) as today_revenue
      FROM edu_orders
    `);

    // Get plan distribution
    const [planDistribution] = await pool.execute(`
      SELECT selected_plan, COUNT(*) as count 
      FROM edu_leads 
      GROUP BY selected_plan
    `);

    // Calculate conversion rate
    const totalVisits = visitorStats[0].total_visits;
    const totalLeads = leadStats[0].total_leads;
    const conversionRate = totalVisits > 0 ? (totalLeads / totalVisits) * 100 : 0;

    res.json({
      edu_visitors: {
        total_visits: totalVisits,
        unique_visitors: visitorStats[0].unique_visitors,
        today_visits: visitorStats[0].today_visits
      },
      edu_leads: {
        total_leads: totalLeads,
        today_leads: leadStats[0].today_leads,
        converted_leads: leadStats[0].converted_leads
      },
      edu_orders: {
        total_orders: orderStats[0].total_orders,
        completed_orders: orderStats[0].completed_orders,
        total_revenue: parseFloat(orderStats[0].total_revenue),
        today_revenue: parseFloat(orderStats[0].today_revenue)
      },
      metrics: {
        conversion_rate: parseFloat(conversionRate.toFixed(2)),
        avg_order_value: orderStats[0].completed_orders > 0 ? 
          parseFloat((orderStats[0].total_revenue / orderStats[0].completed_orders).toFixed(2)) : 0
      },
      plan_distribution: planDistribution
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({
      error: 'Failed to load dashboard data',
      message: error.message
    });
  }
});

// Get recent edu_leads
router.get('/leads/recent', verifyToken, async (req, res) => {
  try {
    const [leads] = await pool.execute(`
      SELECT id, name, email, phone, selected_plan, status, created_at
      FROM edu_leads 
      ORDER BY created_at DESC 
      LIMIT 20
    `);

    res.json({ edu_leads });
  } catch (error) {
    console.error('Recent edu_leads error:', error);
    res.status(500).json({
      error: 'Failed to get recent edu_leads',
      message: error.message
    });
  }
});

// Export edu_leads to CSV
router.get('/export/leads', verifyToken, async (req, res) => {
  try {
    const [leads] = await pool.execute(`
      SELECT name, email, phone, selected_plan, status, created_at
      FROM edu_leads 
      ORDER BY created_at DESC
    `);

    // Convert to CSV
    const csvHeader = 'Name,Email,Phone,Plan,Status,Created Date\n';
    const csvContent = leads.map(lead => 
      `"${lead.name}","${lead.email}","${lead.phone}","${lead.selected_plan}","${lead.status}","${new Date(lead.created_at).toLocaleDateString()}"`
    ).join('\n');

    const csv = csvHeader + csvContent;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export edu_leads error:', error);
    res.status(500).json({
      error: 'Failed to export edu_leads',
      message: error.message
    });
  }
});

module.exports = router;
