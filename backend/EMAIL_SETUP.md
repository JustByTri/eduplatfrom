# Email Setup Instructions - Day 4

## 1. Gmail App Password Setup

Để email service hoạt động, cần tạo Gmail App Password:

### Bước 1: Enable 2-Factor Authentication
1. Đi đến Google Account settings: https://myaccount.google.com
2. Security → 2-Step Verification → Turn on

### Bước 2: Tạo App Password  
1. Google Account → Security → App passwords
2. Chọn "Mail" và "Other (custom name)"
3. Nhập "EnglishMaster Pro Backend"
4. Copy app password (16 ký tự)

### Bước 3: Update Environment Variables

Tạo file `.env` trong backend folder:
```
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-16-character-app-password
```

## 2. Test Email Service

```bash
cd backend
node -e "const emailService = require('./services/emailService'); emailService.testConnection();"
```

## 3. Features Hoàn Thành

✅ Welcome email templates cho 3 gói học (Basic/Premium/Enterprise)
✅ Admin notification khi có lead mới
✅ Email templates responsive với branding
✅ Test endpoint: POST /api/leads/test-email

## 4. Next Steps

- Setup email credentials
- Test email service
- Deploy to production
- Monitor email delivery rates
