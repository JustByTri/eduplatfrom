const express = require('express');
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Plan pricing
const PLAN_PRICES = {
  basic: { original: 399000, discount: 50 },
  premium: { original: 599000, discount: 50 },
  enterprise: { original: 999000, discount: 50 }
};

// Create mock order
router.post('/create', async (req, res) => {
  try {
    const {
      lead_id,
      plan_type,
      payment_method = 'mock_payment'
    } = req.body;

    if (!lead_id || !plan_type) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['lead_id', 'plan_type']
      });
    }

    // Validate plan type
    if (!PLAN_PRICES[plan_type]) {
      return res.status(400).json({
        error: 'Invalid plan type',
        valid_plans: Object.keys(PLAN_PRICES)
      });
    }

    // Check if lead exists
    const [leadExists] = await pool.execute(`
      SELECT id FROM edu_leads WHERE id = ?
    `, [lead_id]);

    if (leadExists.length === 0) {
      return res.status(404).json({
        error: 'Lead not found'
      });
    }

    // Calculate pricing
    const pricing = PLAN_PRICES[plan_type];
    const original_price = pricing.original;
    const discount_percent = pricing.discount;
    const final_price = original_price * (1 - discount_percent / 100);

    // Generate order number
    const order_number = `EM${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const transaction_id = `TXN_${uuidv4()}`;

    // Create order
    const [result] = await pool.execute(`
      INSERT INTO edu_orders (
        lead_id, order_number, plan_type, original_price, 
        discount_percent, final_price, payment_method, transaction_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      lead_id, order_number, plan_type, original_price,
      discount_percent, final_price, payment_method, transaction_id
    ]);

    // Simulate payment processing delay
    setTimeout(async () => {
      try {
        // Random payment result (90% success rate)
        const payment_status = Math.random() > 0.1 ? 'completed' : 'failed';
        
        await pool.execute(`
          UPDATE edu_orders SET payment_status = ? WHERE id = ?
        `, [payment_status, result.insertId]);

        // Update lead status if payment successful
        if (payment_status === 'completed') {
          await pool.execute(`
            UPDATE edu_leads SET status = 'converted' WHERE id = ?
          `, [lead_id]);
        }
      } catch (error) {
        console.error('Error updating payment status:', error);
      }
    }, 2000);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: result.insertId,
        order_number,
        transaction_id,
        plan_type,
        original_price,
        discount_percent,
        final_price,
        payment_status: 'pending'
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      error: 'Failed to create order',
      message: error.message
    });
  }
});

// Check order status
router.get('/:order_number/status', async (req, res) => {
  try {
    const { order_number } = req.params;

    const [orders] = await pool.execute(`
      SELECT o.*, l.name as customer_name, l.email as customer_email
      FROM edu_orders o
      LEFT JOIN edu_leads l ON o.lead_id = l.id
      WHERE o.order_number = ?
    `, [order_number]);

    if (orders.length === 0) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }

    res.json({
      order: edu_orders[0]
    });
  } catch (error) {
    console.error('Error getting order status:', error);
    res.status(500).json({
      error: 'Failed to get order status',
      message: error.message
    });
  }
});

// Get all edu_orders (admin)
router.get('/', async (req, res) => {
  try {
    const { status, plan, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT o.*, l.name as customer_name, l.email as customer_email
      FROM edu_orders o
      LEFT JOIN edu_leads l ON o.lead_id = l.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND o.payment_status = ?';
      params.push(status);
    }

    if (plan) {
      query += ' AND o.plan_type = ?';
      params.push(plan);
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [orders] = await pool.execute(query, params);

    res.json({
      edu_orders
    });
  } catch (error) {
    console.error('Error getting edu_orders:', error);
    res.status(500).json({
      error: 'Failed to get edu_orders',
      message: error.message
    });
  }
});

// Get order stats
router.get('/stats', async (req, res) => {
  try {
    const [totalOrders] = await pool.execute(`
      SELECT COUNT(*) as total FROM edu_orders
    `);

    const [completedOrders] = await pool.execute(`
      SELECT COUNT(*) as completed FROM edu_orders WHERE payment_status = 'completed'
    `);

    const [totalRevenue] = await pool.execute(`
      SELECT COALESCE(SUM(final_price), 0) as revenue 
      FROM edu_orders WHERE payment_status = 'completed'
    `);

    const [todayRevenue] = await pool.execute(`
      SELECT COALESCE(SUM(final_price), 0) as today_revenue 
      FROM edu_orders 
      WHERE payment_status = 'completed' AND DATE(created_at) = CURDATE()
    `);

    const [avgOrderValue] = await pool.execute(`
      SELECT COALESCE(AVG(final_price), 0) as avg_value 
      FROM edu_orders WHERE payment_status = 'completed'
    `);

    res.json({
      total_orders: totalOrders[0].total,
      completed_orders: completedOrders[0].completed,
      total_revenue: parseFloat(totalRevenue[0].revenue),
      today_revenue: parseFloat(todayRevenue[0].today_revenue),
      avg_order_value: parseFloat(avgOrderValue[0].avg_value)
    });
  } catch (error) {
    console.error('Error getting order stats:', error);
    res.status(500).json({
      error: 'Failed to get order stats',
      message: error.message
    });
  }
});

module.exports = router;
