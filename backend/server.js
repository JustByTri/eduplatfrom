// Disable SSL certificate verification (for development/testing only)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// EnglishMaster Pro Backend - Database should be "Eng"
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection } = require('./config/database');
const { createTables, seedAdminUser } = require('./config/init-db');
const { createEmailTable } = require('./services/emailTracking');

// Import routes
const visitorsRoutes = require('./routes/visitors');
const leadsRoutes = require('./routes/leads');
const ordersRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration - Most permissive for debugging
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(cors({
  origin: 'https://eduplatfrom.vercel.app',
  credentials: true,
  methods: '*', 
  allowedHeaders: '*',
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.3' // Force deploy version
  });
});

// CORS test endpoint
app.get('/test-cors', (req, res) => {
  res.json({
    message: 'CORS test successful',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Options test for preflight
app.options('/test-cors', (req, res) => {
  res.status(200).end();
});

// Debug endpoint to check database and admin user
app.get('/debug', async (req, res) => {
  try {
    const { pool } = require('./config/database');
    
    // Check database connection
    const [tables] = await pool.execute('SHOW TABLES');
    
    // Check if admin user exists
    let adminCheck = null;
    try {
      const [admins] = await pool.execute('SELECT id, username, email, is_active FROM edu_admin_users LIMIT 5');
      adminCheck = admins;
    } catch (error) {
      adminCheck = { error: error.message };
    }
    
    res.json({
      database: process.env.DB_NAME,
      tables: tables.map(t => Object.values(t)[0]),
      admin_users: adminCheck,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        DB_HOST: process.env.DB_HOST?.substring(0, 20) + '...',
        DB_NAME: process.env.DB_NAME
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Routes
app.use('/api/visitors', visitorsRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl 
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Create tables and seed data
    await createTables();
    await seedAdminUser();
    await createEmailTable();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 Frontend: ${process.env.FRONTEND_URL}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
