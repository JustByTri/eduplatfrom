const nodemailer = require('nodemailer');
const { getEmailTemplate, getAdminNotificationTemplate } = require('../templates/emailTemplates');
const { logEmail } = require('./emailTracking');

class EmailService {
  constructor() {
    // Setup Gmail SMTP transporter
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'admin@eduplatform.com',
        pass: process.env.EMAIL_PASS || 'your-app-password' // Gmail App Password
      }
    });
  }

  // Welcome email for new leads
  async sendWelcomeEmail(leadData, leadId = null) {
    const { name, email, selected_plan } = leadData;
    
    try {
      const htmlContent = getEmailTemplate(leadData);
      const subject = `🎉 Chào mừng ${name} đến với gói ${selected_plan.toUpperCase()}!`;

      const mailOptions = {
        from: `"EnglishMaster Pro" <${process.env.EMAIL_USER || 'admin@eduplatform.com'}>`,
        to: email,
        subject: subject,
        html: htmlContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      // Log successful email
      await logEmail({
        lead_id: leadId,
        email_type: 'welcome',
        recipient_email: email,
        subject: subject,
        status: 'sent'
      });
      
      return result;
    } catch (error) {
      // Log failed email
      await logEmail({
        lead_id: leadId,
        email_type: 'welcome', 
        recipient_email: email,
        subject: `Welcome email for ${name}`,
        status: 'failed',
        error_message: error.message
      });
      
      throw error;
    }
  }

  // Admin notification email
  async sendAdminNotification(leadData, leadId = null) {
    const { name, selected_plan } = leadData;
    
    try {
      const htmlContent = getAdminNotificationTemplate(leadData);
      const subject = `🔔 New Lead: ${name} - ${selected_plan} package`;

      const mailOptions = {
        from: `"EnglishMaster System" <${process.env.EMAIL_USER || 'admin@eduplatform.com'}>`,
        to: 'admin@eduplatform.com',
        subject: subject,
        html: htmlContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      // Log successful email
      await logEmail({
        lead_id: leadId,
        email_type: 'admin_notification',
        recipient_email: 'admin@eduplatform.com',
        subject: subject,
        status: 'sent'
      });
      
      return result;
    } catch (error) {
      // Log failed email
      await logEmail({
        lead_id: leadId,
        email_type: 'admin_notification',
        recipient_email: 'admin@eduplatform.com', 
        subject: `Admin notification for ${name}`,
        status: 'failed',
        error_message: error.message
      });
      
      throw error;
    }

    const mailOptions = {
      from: `"EnglishMaster System" <${process.env.EMAIL_USER || 'admin@eduplatform.com'}>`,
      to: 'admin@eduplatform.com',
      subject: `🔔 New Lead: ${name} - ${selected_plan} package`,
      html: htmlContent
    };

    return await this.transporter.sendMail(mailOptions);
  }

  // Test email connection
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error.message);
      return false;
    }
  }
}

module.exports = new EmailService();
