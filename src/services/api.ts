// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api'
  : 'http://localhost:5000/api';

// API Service Class
class APIService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('adminToken');
  }

  // Helper method for making requests
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (this.token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Auth methods
  async login(username: string, password: string) {
    const data = await this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (data.success && data.token) {
      this.token = data.token;
      localStorage.setItem('adminToken', data.token);
    }

    return data;
  }

  async verifyToken() {
    return await this.request('/admin/verify');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('adminToken');
  }

  // Visitor tracking
  async trackVisitor(visitorData: {
    ip_address?: string;
    user_agent?: string;
    referrer?: string;
    landing_page?: string;
  }) {
    return await this.request('/visitors/track', {
      method: 'POST',
      body: JSON.stringify({
        ip_address: visitorData.ip_address || 'unknown',
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        landing_page: window.location.pathname,
        ...visitorData,
      }),
    });
  }

  // Lead management
  async submitLead(leadData: {
    name: string;
    email: string;
    phone: string;
    selected_plan: string;
    source?: string;
  }) {
    return await this.request('/leads', {
      method: 'POST',
      body: JSON.stringify({
        ...leadData,
        ip_address: 'unknown',
        source: leadData.source || 'landing_page',
      }),
    });
  }

  async getLeads(params?: {
    status?: string;
    plan?: string;
    limit?: number;
    offset?: number;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return await this.request(`/leads${queryString}`);
  }

  async updateLeadStatus(leadId: number, status: string, notes?: string) {
    return await this.request(`/leads/${leadId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  // Order management
  async createOrder(orderData: {
    lead_id: number;
    plan_type: string;
    payment_method?: string;
  }) {
    return await this.request('/orders/create', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrderStatus(orderNumber: string) {
    return await this.request(`/orders/${orderNumber}/status`);
  }

  async getOrders(params?: {
    status?: string;
    plan?: string;
    limit?: number;
    offset?: number;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return await this.request(`/orders${queryString}`);
  }

  // Admin dashboard
  async getDashboardData() {
    return await this.request('/admin/dashboard');
  }

  async getRecentLeads() {
    return await this.request('/admin/leads/recent');
  }

  async exportLeads() {
    const response = await fetch(`${this.baseURL}/admin/export/leads`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export leads');
    }

    // Return blob for download
    return await response.blob();
  }

  // Analytics
  async getAnalyticsSummary(period: number = 7) {
    return await this.request(`/analytics/summary?period=${period}`);
  }

  async getTrafficSources() {
    return await this.request('/analytics/traffic-sources');
  }

  // Statistics endpoints
  async getVisitorStats() {
    return await this.request('/visitors/stats');
  }

  async getLeadStats() {
    return await this.request('/leads/stats');
  }

  async getOrderStats() {
    return await this.request('/orders/stats');
  }
}

// Export singleton instance
export const apiService = new APIService();
export default apiService;
