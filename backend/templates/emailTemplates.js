const getEmailTemplate = (leadData) => {
  const { name, selected_plan } = leadData;
  
  const planDetails = {
    basic: {
      title: 'Gói Học Basic',
      price: '899,000 VNĐ/tháng',
      duration: '6 tháng',
      features: [
        '20 bài học cơ bản từ beginner đến intermediate',
        'Tài liệu PDF và worksheets',
        'Email support trong giờ hành chính',
        'Community group chat'
      ],
      cta: 'Bắt Đầu Học Basic',
      color: '#22c55e'
    },
    premium: {
      title: 'Gói Học Premium',
      price: '1,599,000 VNĐ/tháng', 
      duration: '12 tháng',
      features: [
        '50 bài học nâng cao với video HD',
        'Weekly 1-on-1 coaching session (30 phút)',
        'Pronunciation training với AI',
        'Certificate hoàn thành có giá trị',
        'Priority support 24/7'
      ],
      cta: 'Upgrade Lên Premium',
      color: '#3b82f6'
    },
    enterprise: {
      title: 'Gói Học Enterprise',
      price: '2,999,000 VNĐ/tháng',
      duration: '24 tháng',
      features: [
        'Unlimited access toàn bộ khóa học',
        'Live classes hàng tuần với native speakers', 
        'Personal mentor 1-on-1 hàng ngày',
        'Job interview preparation',
        'Job placement guarantee',
        'Custom curriculum theo nhu cầu'
      ],
      cta: 'Đăng Ký Enterprise',
      color: '#8b5cf6'
    }
  };

  const plan = planDetails[selected_plan] || planDetails.basic;

  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Welcome to EnglishMaster Pro - ${plan.title}</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; background: white;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, ${plan.color} 0%, #1e293b 100%); color: white; padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: bold;">EnglishMaster Pro</h1>
              <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">Welcome ${name}!</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px;">
              <h2 style="color: ${plan.color}; margin: 0 0 20px 0; font-size: 24px;">Chúc mừng bạn đã chọn ${plan.title}</h2>
              
              <p style="font-size: 16px; margin: 0 0 25px 0;">
                  Xin chào <strong>${name}</strong>,<br><br>
                  Cảm ơn bạn đã tin tưởng và đăng ký <strong>${plan.title}</strong>! 
                  Đây là bước đầu tiên trong hành trình chinh phục tiếng Anh của bạn.
              </p>
              
              <!-- Package Details -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin: 25px 0;">
                  <h3 style="margin: 0 0 15px 0; color: ${plan.color}; font-size: 20px;">${plan.title}</h3>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                      <span style="font-size: 18px; font-weight: bold; color: ${plan.color};">${plan.price}</span>
                      <span style="color: #64748b;">Thời hạn: ${plan.duration}</span>
                  </div>
                  
                  <h4 style="margin: 20px 0 10px 0; color: #1e293b;">Những gì bạn sẽ nhận được:</h4>
                  <ul style="margin: 0; padding-left: 0; list-style: none;">
                      ${plan.features.map(feature => `
                          <li style="margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                              <span style="color: ${plan.color}; margin-right: 8px;">✓</span>
                              ${feature}
                          </li>
                      `).join('')}
                  </ul>
              </div>
              
              <!-- Next Steps -->
              <div style="background: #eff6ff; border-left: 4px solid ${plan.color}; padding: 20px; margin: 25px 0;">
                  <h3 style="margin: 0 0 15px 0; color: ${plan.color};">Bước tiếp theo của bạn:</h3>
                  <ol style="margin: 0; padding-left: 20px;">
                      <li style="margin: 8px 0;"><strong>Tư vấn cá nhân:</strong> Team sẽ gọi điện trong 2-4 giờ tới</li>
                      <li style="margin: 8px 0;"><strong>Đánh giá trình độ:</strong> Test miễn phí để thiết kế lộ trình</li>
                      <li style="margin: 8px 0;"><strong>Bắt đầu học:</strong> Nhận tài khoản và bài học đầu tiên</li>
                  </ol>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 35px 0;">
                  <a href="https://eduplatfrom.vercel.app" 
                     style="background: ${plan.color}; color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                     ${plan.cta}
                  </a>
              </div>
              
              <!-- Success Stories -->
              <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
                  <h4 style="margin: 0 0 15px 0; color: #1e293b;">Câu chuyện thành công:</h4>
                  <p style="margin: 0; font-style: italic; color: #64748b;">
                      "Sau 6 tháng học với EnglishMaster Pro, tôi đã pass được IELTS 7.5 và nhận được job offer từ công ty đa quốc gia!"
                  </p>
                  <p style="margin: 5px 0 0 0; font-size: 14px; color: #94a3b8;">- Nguyễn Minh Anh, Software Engineer</p>
              </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b;">
                  Hotline: <strong>1900-1234</strong> | Email: <strong>support@eduplatform.com</strong>
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                  EnglishMaster Pro - Nền tảng học tiếng Anh hàng đầu Việt Nam<br>
                  Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
              </p>
          </div>
      </div>
  </body>
  </html>`;
};

const getAdminNotificationTemplate = (leadData) => {
  const { name, email, phone, selected_plan } = leadData;
  const planEmoji = {
    basic: '📗',
    premium: '📘', 
    enterprise: '📕'
  };

  return `
  <!DOCTYPE html>
  <html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #333; max-width: 500px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 20px; text-align: center; border-radius: 8px;">
          <h2 style="margin: 0; font-size: 20px;">New Lead Alert!</h2>
          <p style="margin: 5px 0 0 0;">EnglishMaster Pro Dashboard</p>
      </div>
      
      <div style="padding: 25px; background: #f8fafc; margin: 15px 0; border-radius: 8px;">
          <h3 style="margin: 0 0 15px 0; color: #1e293b;">Lead Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold;">Name:</td><td>${name}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td><a href="tel:${phone}">${phone}</a></td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Package:</td><td>${planEmoji[selected_plan] || '📦'} ${selected_plan.toUpperCase()}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Time:</td><td>${new Date().toLocaleString('vi-VN')}</td></tr>
          </table>
      </div>
      
      <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 0; color: #166534; font-weight: bold;">Action Required:</p>
          <ul style="margin: 10px 0; color: #166534;">
              <li>Call within 2-4 hours for consultation</li>
              <li>Send package details and pricing</li>
              <li>Update CRM status</li>
          </ul>
      </div>
      
      <div style="text-align: center; margin: 20px 0;">
          <a href="https://eduplatfrom.vercel.app/admin" 
             style="background: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
             View Dashboard
          </a>
      </div>
      
      <p style="font-size: 12px; color: #64748b; text-align: center; margin: 15px 0 0 0;">
          EnglishMaster Pro Admin System
      </p>
  </body>
  </html>`;
};

module.exports = { getEmailTemplate, getAdminNotificationTemplate };
