const { pool } = require('../config/database');

// Create email logs table if not exists
const createEmailTable = async () => {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS edu_email_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        lead_id INT,
        email_type ENUM('welcome', 'admin_notification', 'follow_up') NOT NULL,
        recipient_email VARCHAR(255) NOT NULL,
        subject VARCHAR(500),
        status ENUM('sent', 'failed', 'bounced', 'opened') DEFAULT 'sent',
        error_message TEXT,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        opened_at TIMESTAMP NULL,
        INDEX idx_lead_id (lead_id),
        INDEX idx_email_type (email_type),
        INDEX idx_sent_at (sent_at)
      )
    `);
    console.log('✅ Email logs table ready');
  } catch (error) {
    console.error('❌ Failed to create email table:', error);
  }
};

// Log email activity
const logEmail = async (data) => {
  try {
    const { lead_id, email_type, recipient_email, subject, status, error_message } = data;
    
    await pool.execute(`
      INSERT INTO edu_email_logs (lead_id, email_type, recipient_email, subject, status, error_message)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [lead_id, email_type, recipient_email, subject, status, error_message]);
    
  } catch (error) {
    console.error('Failed to log email:', error);
  }
};

// Get email stats
const getEmailStats = async () => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        email_type,
        status,
        COUNT(*) as count
      FROM edu_email_logs 
      GROUP BY email_type, status
    `);
    
    const [totalStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_emails,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as successful_emails,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_emails,
        SUM(CASE WHEN opened_at IS NOT NULL THEN 1 ELSE 0 END) as opened_emails
      FROM edu_email_logs
    `);
    
    return {
      detailed_stats: stats,
      summary: totalStats[0] || {
        total_emails: 0,
        successful_emails: 0, 
        failed_emails: 0,
        opened_emails: 0
      }
    };
  } catch (error) {
    console.error('Failed to get email stats:', error);
    return { detailed_stats: [], summary: {} };
  }
};

module.exports = {
  createEmailTable,
  logEmail,
  getEmailStats
};
