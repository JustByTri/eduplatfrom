// Quick fix script to update all table names
const fs = require('fs');
const path = require('path');

const files = [
  'routes/admin.js',
  'routes/leads.js', 
  'routes/orders.js',
  'routes/analytics.js'
];

const replacements = [
  [' admin_users', ' edu_admin_users'],
  [' leads', ' edu_leads'],
  [' orders', ' edu_orders'],  
  [' visitors', ' edu_visitors'],
  [' analytics_daily', ' edu_analytics_daily'],
  ['FROM admin_users', 'FROM edu_admin_users'],
  ['FROM leads', 'FROM edu_leads'],
  ['FROM orders', 'FROM edu_orders'],
  ['FROM visitors', 'FROM edu_visitors'],
  ['FROM analytics_daily', 'FROM edu_analytics_daily'],
  ['INTO admin_users', 'INTO edu_admin_users'],
  ['INTO leads', 'INTO edu_leads'],
  ['INTO orders', 'INTO edu_orders'],
  ['INTO visitors', 'INTO edu_visitors'],
  ['INTO analytics_daily', 'INTO edu_analytics_daily'],
  ['UPDATE admin_users', 'UPDATE edu_admin_users'],
  ['UPDATE leads', 'UPDATE edu_leads'],
  ['UPDATE orders', 'UPDATE edu_orders'],
  ['UPDATE visitors', 'UPDATE edu_visitors'],
  ['UPDATE analytics_daily', 'UPDATE edu_analytics_daily']
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    replacements.forEach(([oldText, newText]) => {
      content = content.replace(new RegExp(oldText, 'g'), newText);
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${file}`);
  }
});

console.log('🎉 All table names updated!');
