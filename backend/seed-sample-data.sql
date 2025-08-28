-- Seed some sample data for testing

-- Insert sample visitors
INSERT INTO edu_visitors (ip_address, user_agent, referrer, landing_page, session_id, device_type) VALUES
('192.168.1.100', 'Chrome-Desktop', 'https://google.com', '/', 'session-001', 'desktop'),
('192.168.1.101', 'Safari-Mobile', 'https://facebook.com', '/', 'session-002', 'mobile'),
('192.168.1.102', 'Chrome-Desktop', 'direct', '/', 'session-003', 'desktop'),
('192.168.1.103', 'Firefox-Desktop', 'https://linkedin.com', '/', 'session-004', 'desktop'),
('192.168.1.104', 'Chrome-Mobile', 'https://instagram.com', '/', 'session-005', 'mobile');

-- Insert sample leads
INSERT INTO edu_leads (name, email, phone, selected_plan, source, status, ip_address) VALUES
('Nguyễn Văn An', 'van.an@example.com', '0901234567', 'premium', 'landing_page', 'new', '192.168.1.100'),
('Trần Thị Bình', 'thi.binh@example.com', '0987654321', 'basic', 'landing_page', 'contacted', '192.168.1.101'),
('Lê Minh Cường', 'minh.cuong@example.com', '0912345678', 'enterprise', 'landing_page', 'new', '192.168.1.102'),
('Phạm Thu Hương', 'thu.huong@example.com', '0976543210', 'premium', 'landing_page', 'converted', '192.168.1.103'),
('Đỗ Quang Huy', 'quang.huy@example.com', '0934567890', 'basic', 'landing_page', 'new', '192.168.1.104');

-- Insert sample orders
INSERT INTO edu_orders (lead_id, order_number, plan_type, original_price, discount_percent, final_price, payment_status, payment_method) VALUES
(4, 'ORD-001-2025', 'premium', 1999000, 50, 999500, 'completed', 'credit_card'),
(1, 'ORD-002-2025', 'premium', 1999000, 30, 1399300, 'pending', 'bank_transfer'),
(3, 'ORD-003-2025', 'enterprise', 4999000, 20, 3999200, 'completed', 'credit_card');
