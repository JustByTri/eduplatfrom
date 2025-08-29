const emailService = require('./services/emailService');
const { createEmailTable } = require('./services/emailTracking');

const testEmailSystem = async () => {
  console.log('🧪 Testing Email System...\n');
  
  try {
    // 1. Create email table
    console.log('1️⃣ Creating email logs table...');
    await createEmailTable();
    
    // 2. Test email connection
    console.log('2️⃣ Testing email connection...');
    const isConnected = await emailService.testConnection();
    
    if (!isConnected) {
      console.log('❌ Email service not connected. Please check credentials.');
      console.log('📋 Setup instructions in backend/EMAIL_SETUP.md');
      return;
    }
    
    // 3. Test welcome email templates
    console.log('3️⃣ Testing email templates...\n');
    
    const testLeads = [
      { name: 'Test Basic', email: 'test+basic@example.com', phone: '0123456789', selected_plan: 'basic' },
      { name: 'Test Premium', email: 'test+premium@example.com', phone: '0987654321', selected_plan: 'premium' },
      { name: 'Test Enterprise', email: 'test+enterprise@example.com', phone: '0111222333', selected_plan: 'enterprise' }
    ];
    
    for (const lead of testLeads) {
      console.log(`📧 Testing ${lead.selected_plan.toUpperCase()} email template...`);
      
      try {
        await emailService.sendWelcomeEmail(lead);
        console.log(`   ✅ Welcome email sent to ${lead.email}`);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
      
      try {
        await emailService.sendAdminNotification(lead);
        console.log(`   ✅ Admin notification sent for ${lead.name}`);
      } catch (error) {
        console.log(`   ❌ Admin notification failed: ${error.message}`);
      }
      
      console.log('');
    }
    
    console.log('🎉 Email system test completed!');
    console.log('📊 Check your email inbox and admin@eduplatform.com for test emails');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    process.exit(0);
  }
};

testEmailSystem();
