# Backend API Documentation

## Environment Setup
1. Copy `.env.example` to `.env`
2. Update database credentials
3. Install dependencies: `npm install`
4. Start server: `npm run dev`

## API Endpoints

### Public Endpoints
- `POST /api/visitors/track` - Track website visitor
- `POST /api/leads` - Submit lead form
- `POST /api/orders/create` - Create mock order
- `GET /api/orders/:order_number/status` - Check order status

### Admin Endpoints (Require Authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Dashboard data
- `GET /api/admin/leads/recent` - Recent leads
- `GET /api/admin/export/leads` - Export leads CSV

### Analytics Endpoints
- `GET /api/analytics/summary?period=7` - Analytics summary
- `GET /api/analytics/traffic-sources` - Traffic source breakdown

## Database Schema
- `visitors` - Website traffic tracking
- `leads` - Lead form submissions
- `orders` - Payment transactions
- `admin_users` - Admin authentication
- `analytics_daily` - Daily aggregated stats

## Authentication
- JWT tokens for admin authentication
- 24-hour token expiration
- Bcrypt password hashing

## Mock Payment Flow
1. Create order with `POST /api/orders/create`
2. System randomly processes payment (90% success rate)
3. Check status with `GET /api/orders/:order_number/status`
4. Successful payments update lead status to 'converted'
