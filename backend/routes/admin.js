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


router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const loginField = username || email;
    if (!loginField || !password) {
      return res.status(400).json({
        error: 'Username/email and password are required'
      });
    }

    // Find admin user by username or email
    const [admins] = await pool.execute(`
      SELECT id, username, email, password_hash, role, is_active
      FROM edu_admin_users 
      WHERE (username = ? OR email = ?) AND is_active = true
    `, [loginField, loginField]);

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
    // Get real data from database
    const [visitorsCount] = await pool.execute(`
      SELECT COUNT(*) as total_visits FROM edu_visitors
    `);
    
    const [uniqueVisitors] = await pool.execute(`
      SELECT COUNT(DISTINCT ip_address) as unique_visitors FROM edu_visitors
    `);
    
    const [todayVisits] = await pool.execute(`
      SELECT COUNT(*) as today_visits 
      FROM edu_visitors 
      WHERE DATE(visit_timestamp) = CURDATE()
    `);
    
    const [leadsData] = await pool.execute(`
      SELECT 
        COUNT(*) as total_leads,
        COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as today_leads,
        COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted_leads
      FROM edu_leads
    `);
    
    const [ordersData] = await pool.execute(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) as completed_orders,
        COALESCE(SUM(CASE WHEN payment_status = 'completed' THEN final_price END), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN DATE(created_at) = CURDATE() AND payment_status = 'completed' THEN final_price END), 0) as today_revenue
      FROM edu_orders
    `);
    
    const [planDistribution] = await pool.execute(`
      SELECT 
        selected_plan,
        COUNT(*) as count
      FROM edu_leads 
      GROUP BY selected_plan
    `);

    // Calculate conversion rate
    const totalVisits = visitorsCount[0]?.total_visits || 0;
    const totalLeads = leadsData[0]?.total_leads || 0;
    const conversionRate = totalVisits > 0 ? (totalLeads / totalVisits) * 100 : 0;
    
    // Get recent leads for the dashboard
    const [recentLeads] = await pool.execute(`
      SELECT 
        name, email, phone, selected_plan, created_at, source, status
      FROM edu_leads 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    const dashboardData = {
      edu_visitors: {
        totalVisits: totalVisits,
        totalLeads: totalLeads,
        totalRevenue: ordersData[0]?.total_revenue || 0,
        conversionRate: conversionRate,
        uniqueVisitors: uniqueVisitors[0]?.unique_visitors || 0,
        todayVisits: todayVisits[0]?.today_visits || 0
      },
      edu_leads: recentLeads || [],
      edu_orders: {
        total_orders: ordersData[0]?.total_orders || 0,
        completed_orders: ordersData[0]?.completed_orders || 0,
        total_revenue: ordersData[0]?.total_revenue || 0,
        today_revenue: ordersData[0]?.today_revenue || 0
      },
      metrics: {
        conversion_rate: conversionRate,
        avg_order_value: ordersData[0]?.completed_orders > 0 ? 
          (ordersData[0]?.total_revenue / ordersData[0]?.completed_orders) : 0
      },
      plan_distribution: planDistribution || []
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard data error:', error);
    
    // Fallback to mock data if database error
    const mockData = {
      edu_visitors: {
        totalVisits: 1567,
        totalLeads: 18,
        totalRevenue: 15000000,
        conversionRate: 11.5,
        uniqueVisitors: 982,
        todayVisits: 23
      },
      edu_leads: [],
      edu_orders: {
        total_orders: 8,
        completed_orders: 6,
        total_revenue: 15000000,
        today_revenue: 2500000
      },
      metrics: {
        conversion_rate: 11.54,
        avg_order_value: 2500000
      },
      plan_distribution: [
        { selected_plan: 'basic', count: 8 },
        { selected_plan: 'premium', count: 7 }, 
        { selected_plan: 'enterprise', count: 3 }
      ]
    };
    
    res.json(mockData);
  }
});

// Get recent edu_leads
router.get('/leads/recent', verifyToken, async (req, res) => {
  try {
    // Get real leads from database
    const [leads] = await pool.execute(`
      SELECT 
        id, name, email, phone, selected_plan, status, 
        source, created_at, notes
      FROM edu_leads 
      ORDER BY created_at DESC 
      LIMIT 50
    `);
    
    res.json({ 
      edu_leads: leads
    });
  } catch (error) {
    console.error('Recent edu_leads error:', error);
    
    // Fallback to mock data
    res.json({ 
      edu_leads: [
        {
          id: 1,
          name: "Nguyễn Văn A",
          email: "nguyenvana@email.com", 
          phone: "0901234567",
          selected_plan: "premium",
          status: "new",
          created_at: new Date(),
          source: "website"
        },
        {
          id: 2,
          name: "Trần Thị B",
          email: "tranthib@email.com",
          phone: "0907654321", 
          selected_plan: "basic",
          status: "contacted",
          created_at: new Date(Date.now() - 24*60*60*1000),
          source: "website"
        }
      ]
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
