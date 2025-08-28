import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Custom hook for visitor tracking
export const useVisitorTracking = () => {
  const [isTracked, setIsTracked] = useState(false);

  const trackVisitor = async () => {
    if (isTracked) return;
    
    try {
      await apiService.trackVisitor({});
      setIsTracked(true);
      
     
      localStorage.setItem('visitor_tracked', 'true');
    } catch (error) {
      console.error('Failed to track visitor:', error);
    }
  };

  useEffect(() => {
    const alreadyTracked = localStorage.getItem('visitor_tracked');
    if (!alreadyTracked) {
      trackVisitor();
    } else {
      setIsTracked(true);
    }
  }, []);

  return { isTracked, trackVisitor };
};


export const useLeadSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const submitLead = async (leadData: {
    name: string;
    email: string;
    phone: string;
    selected_plan: string;
  }) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await apiService.submitLead(leadData);
      setSuccess(true);
      
      toast({
        title: "Đăng ký thành công!",
        description: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
        duration: 5000,
      });

      // Track conversion in localStorage for backward compatibility
      const leads = JSON.parse(localStorage.getItem('leads') || '[]');
      leads.push({
        ...leadData,
        timestamp: new Date().toISOString(),
        source: 'landing_page'
      });
      localStorage.setItem('leads', JSON.stringify(leads));

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      
      toast({
        title: "Đăng ký thất bại",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetState = () => {
    setSuccess(false);
    setError(null);
    setIsSubmitting(false);
  };

  return {
    submitLead,
    isSubmitting,
    success,
    error,
    resetState
  };
};

// Custom hook for dashboard data
export const useDashboardData = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const result = await apiService.getDashboardData();
      setData(result);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load dashboard data';
      setError(errorMessage);
      
      // Fallback to localStorage data
      const fallbackData = {
        visitors: {
          total_visits: parseInt(localStorage.getItem('totalVisits') || '0'),
          unique_visitors: parseInt(localStorage.getItem('totalVisits') || '0'),
          today_visits: 0
        },
        leads: {
          total_leads: JSON.parse(localStorage.getItem('leads') || '[]').length,
          today_leads: 0,
          converted_leads: 0
        },
        orders: {
          total_orders: 0,
          completed_orders: 0,
          total_revenue: 0,
          today_revenue: 0
        },
        metrics: {
          conversion_rate: 0,
          avg_order_value: 0
        },
        plan_distribution: []
      };
      setData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refresh: fetchDashboardData };
};

// Custom hook for authentication
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const login = async (username: string, password: string) => {
    try {
      const result = await apiService.login(username, password);
      
      if (result.success) {
        setIsAuthenticated(true);
        setUser(result.admin);
        
        toast({
          title: "Đăng nhập thành công!",
          description: `Chào mừng ${result.admin.username}`,
          duration: 3000,
        });

        return result;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại';
      
      toast({
        title: "Đăng nhập thất bại",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      
      throw error;
    }
  };

  const logout = () => {
    apiService.logout();
    setIsAuthenticated(false);
    setUser(null);
    
    toast({
      title: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất khỏi hệ thống admin.",
      duration: 3000,
    });
  };

  const checkAuth = async () => {
    try {
      setLoading(true);
      
      // Check if token exists first
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }
      
      const result = await apiService.verifyToken();
      if (result.success) {
        setIsAuthenticated(true);
        setUser(result.admin);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        apiService.logout();
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      apiService.logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuth
  };
};

// Custom hook for lead management
export const useLeadManagement = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async (params?: any) => {
    try {
      setLoading(true);
      const result = await apiService.getLeads(params);
      setLeads(result.leads);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch leads';
      setError(errorMessage);
      
      // Fallback to localStorage
      const fallbackLeads = JSON.parse(localStorage.getItem('leads') || '[]');
      setLeads(fallbackLeads);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: number, status: string, notes?: string) => {
    try {
      await apiService.updateLeadStatus(leadId, status, notes);
      await fetchLeads(); // Refresh list
      
      return true;
    } catch (error) {
      console.error('Failed to update lead status:', error);
      return false;
    }
  };

  const exportLeads = async () => {
    try {
      const blob = await apiService.exportLeads();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'leads.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Failed to export leads:', error);
      return false;
    }
  };

  return {
    leads,
    loading,
    error,
    fetchLeads,
    updateLeadStatus,
    exportLeads
  };
};

// Custom hook for payment processing
export const usePayment = () => {
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const processPayment = async (leadId: number, planType: string) => {
    try {
      setProcessing(true);
      setPaymentStatus('pending');
      
      const result = await apiService.createOrder({
        lead_id: leadId,
        plan_type: planType,
        payment_method: 'mock_payment'
      });

      if (result.success) {
        toast({
          title: "Đang xử lý thanh toán...",
          description: `Mã đơn hàng: ${result.order.order_number}`,
          duration: 5000,
        });

        // Poll for payment status
        setTimeout(async () => {
          try {
            const statusResult = await apiService.getOrderStatus(result.order.order_number);
            const finalStatus = statusResult.order.payment_status;
            
            setPaymentStatus(finalStatus);
            
            if (finalStatus === 'completed') {
              toast({
                title: "Thanh toán thành công!",
                description: "Chúng tôi sẽ kích hoạt khóa học cho bạn ngay lập tức.",
                duration: 5000,
              });
            } else if (finalStatus === 'failed') {
              toast({
                title: "Thanh toán thất bại",
                description: "Vui lòng thử lại hoặc liên hệ hỗ trợ.",
                variant: "destructive",
                duration: 5000,
              });
            }
          } catch (error) {
            console.error('Error checking payment status:', error);
          } finally {
            setProcessing(false);
          }
        }, 3000);

        return result;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      
      toast({
        title: "Lỗi thanh toán",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      
      setProcessing(false);
      throw error;
    }
  };

  const resetPayment = () => {
    setProcessing(false);
    setPaymentStatus(null);
  };

  return {
    processPayment,
    processing,
    paymentStatus,
    resetPayment
  };
};
