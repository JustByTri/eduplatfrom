const express = require('express');
const { pool } = require('../config/database');
const emailService = require('../services/emailService');
const router = express.Router();

// Submit lead form
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      selected_plan,
      source = 'landing_page',
      ip_address
    } = req.body;

    // Validation
    if (!name || !email || !selected_plan) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'email', 'selected_plan']
      });
    }

    // Check if email already exists
    const [existingLead] = await pool.execute(`
      SELECT id FROM edu_leads WHERE email = ?
    `, [email]);

    if (existingLead.length > 0) {
      return res.status(409).json({
        error: 'Email already registered',
        message: 'This email has already been registered for our courses'
      });
    }

    // Insert new lead
    const [result] = await pool.execute(`
      INSERT INTO edu_leads (name, email, phone, selected_plan, source, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, email, phone, selected_plan, source, ip_address]);

    // Send welcome email to lead (async, don't block response)
    const leadData = { name, email, phone, selected_plan };
    emailService.sendWelcomeEmail(leadData, result.insertId)
      .then(() => console.log(`✅ Welcome email sent to ${email}`))
      .catch(error => console.error(`❌ Failed to send welcome email to ${email}:`, error.message));
    
    // Send notification email to admin (async)  
    emailService.sendAdminNotification(leadData, result.insertId)
      .then(() => console.log(`📧 Admin notification sent for lead ${name}`))
      .catch(error => console.error(`❌ Failed to send admin notification:`, error.message));

    res.status(201).json({
      success: true,
      message: 'Lead registered successfully',
      lead_id: result.insertId,
      data: {
        name,
        email,
        selected_plan
      }
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({
      error: 'Failed to register lead',
      message: error.message
    });
  }
});

// Get all edu_leads (admin only)
router.get('/', async (req, res) => {
  try {
    const { status, plan, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM edu_leads WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (plan) {
      query += ' AND selected_plan = ?';
      params.push(plan);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [edu_leads] = await pool.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM edu_leads WHERE 1=1';
    const countParams = [];
    
    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    
    if (plan) {
      countQuery += ' AND selected_plan = ?';
      countParams.push(plan);
    }

    const [countResult] = await pool.execute(countQuery, countParams);

    res.json({
      edu_leads,
      pagination: {
        total: countResult[0].total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error getting edu_leads:', error);
    res.status(500).json({
      error: 'Failed to get edu_leads',
      message: error.message
    });
  }
});

// Update lead status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['new', 'contacted', 'converted', 'lost'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        valid_statuses: validStatuses
      });
    }

    const [result] = await pool.execute(`
      UPDATE edu_leads SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, notes || null, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Lead not found'
      });
    }

    res.json({
      success: true,
      message: 'Lead status updated successfully'
    });
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({
      error: 'Failed to update lead status',
      message: error.message
    });
  }
});

// Get lead stats
router.get('/stats', async (req, res) => {
  try {
    const [totaledu_leads] = await pool.execute(`
      SELECT COUNT(*) as total FROM edu_leads
    `);

    const [newedu_leads] = await pool.execute(`
      SELECT COUNT(*) as new_count FROM edu_leads 
      WHERE DATE(created_at) = CURDATE()
    `);

    const [planDistribution] = await pool.execute(`
      SELECT selected_plan, COUNT(*) as count 
      FROM edu_leads 
      GROUP BY selected_plan
    `);

    const [statusDistribution] = await pool.execute(`
      SELECT status, COUNT(*) as count 
      FROM edu_leads 
      GROUP BY status
    `);

    res.json({
      total_edu_leads: totaledu_leads[0].total,
      new_edu_leads_today: newedu_leads[0].new_count,
      plan_distribution: planDistribution,
      status_distribution: statusDistribution
    });
  } catch (error) {
    console.error('Error getting lead stats:', error);
    res.status(500).json({
      error: 'Failed to get lead stats',
      message: error.message
    });
  }
});

// Test email service endpoint
router.post('/test-email', async (req, res) => {
  try {
    const testLead = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '0123456789',
      selected_plan: 'premium'
    };

    // Test email connection first
    const isConnected = await emailService.testConnection();
    if (!isConnected) {
      return res.status(500).json({
        error: 'Email service not configured',
        message: 'Please check email credentials'
      });
    }

    // Send test emails
    await emailService.sendWelcomeEmail(testLead);
    await emailService.sendAdminNotification(testLead);

    res.json({
      success: true,
      message: 'Test emails sent successfully',
      emails_sent: ['welcome', 'admin_notification']
    });
  } catch (error) {
    console.error('Email test failed:', error);
    res.status(500).json({
      error: 'Email test failed',
      message: error.message
    });
  }
});

// Test email service endpoint
router.post('/test-email', async (req, res) => {
  try {
    const testLead = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '0123456789',
      selected_plan: 'premium'
    };

    // Test email connection first
    const isConnected = await emailService.testConnection();
    if (!isConnected) {
      return res.status(500).json({
        error: 'Email service not configured',
        message: 'Please check email credentials'
      });
    }

    // Send test emails
    await emailService.sendWelcomeEmail(testLead);
    await emailService.sendAdminNotification(testLead);

    res.json({
      success: true,
      message: 'Test emails sent successfully',
      emails_sent: ['welcome', 'admin_notification']
    });
  } catch (error) {
    console.error('Email test failed:', error);
    res.status(500).json({
      error: 'Email test failed',
      message: error.message
    });
  }
});

module.exports = router;
