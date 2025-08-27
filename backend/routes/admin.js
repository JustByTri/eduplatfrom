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
    // Return mock data for now (safe approach)
    res.json({
      edu_visitors: {
        total_visits: 156,
        unique_visitors: 98,
        today_visits: 23
      },
      edu_leads: {
        total_leads: 18,
        today_leads: 5,
        converted_leads: 3
      },
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
    // Return mock leads data
    res.json({ 
      edu_leads: [
        {
          id: 1,
          name: "Nguyễn Văn A",
          email: "nguyenvana@email.com", 
          phone: "0901234567",
          selected_plan: "premium",
          status: "new",
          created_at: new Date()
        },
        {
          id: 2,
          name: "Trần Thị B",
          email: "tranthib@email.com",
          phone: "0907654321", 
          selected_plan: "basic",
          status: "contacted",
          created_at: new Date(Date.now() - 24*60*60*1000)
        }
      ]
    });
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
