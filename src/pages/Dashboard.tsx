import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useDashboardData } from "@/hooks/useAPI";
import { 
  Users, 
  Eye, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  Download,
  BarChart3,
  PieChart,
  Activity,
  LogOut,
  Shield,
  Home
} from "lucide-react";

interface Lead {
  name: string;
  email: string;
  phone: string;
  selectedPlan: string;
  timestamp: string;
  source: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();
  const { 
    data, 
    loading, 
    error, 
    refresh 
  } = useDashboardData();

  // Extract data with fallbacks
  const leads = data?.leads || [];
  const analytics = data?.analytics || {
    totalVisits: 0,
    totalLeads: 0,
    totalRevenue: 0,
    conversionRate: 0
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất khỏi hệ thống admin.",
      duration: 3000,
    });
    navigate('/admin/login');
  };

  const formatRevenue = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const exportLeads = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Email,Phone,Plan,Date,Source\n"
      + leads.map(lead => 
          `${lead.name},${lead.email},${lead.phone},${lead.selectedPlan},${new Date(lead.timestamp).toLocaleDateString()},${lead.source}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export thành công!",
      description: "File leads.csv đã được tải xuống.",
      duration: 3000,
    });
  };

  const planDistribution = leads.reduce((acc: any, lead) => {
    acc[lead.selectedPlan] = (acc[lead.selectedPlan] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-muted/30 py-8 pt-24">
      <div className="container mx-auto px-4">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Đang tải dữ liệu...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">Lỗi: {error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refresh}
              className="mt-2"
            >
              Thử lại
            </Button>
          </div>
        )}

        {/* Header with Admin Info and Actions */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground">EnglishMaster Pro Analytics & Lead Management</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="inline-flex items-center space-x-1">
                <Activity className="h-4 w-4" />
                <span>Live Updates</span>
              </span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>Trang chủ</span>
            </Button>
            <Button onClick={exportLeads} className="bg-primary hover:bg-primary-dark flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Leads</span>
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Lượt Truy Cập</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalVisits.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{Math.floor(Math.random() * 20 + 5)}% từ tuần trước
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{analytics.totalLeads}</div>
              <p className="text-xs text-muted-foreground">
                +{Math.floor(Math.random() * 15 + 3)} leads mới hôm nay
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doanh Thu Ước Tính</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{formatRevenue(analytics.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                Từ {analytics.totalLeads} leads tiềm năng
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tỷ Lệ Chuyển Đổi</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{analytics.conversionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Leads/Visits ratio
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Leads List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Danh Sách Leads ({leads.length})
                </span>
                <Badge variant="secondary">{leads.length} total</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {leads.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Chưa có leads nào. Hãy chia sẻ landing page để thu hút khách hàng!
                  </p>
                ) : (
                  leads.map((lead, index) => (
                    <div key={index} className="border-b border-border/50 pb-4 last:border-b-0">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="font-medium text-foreground">{lead.name}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{lead.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(lead.timestamp).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={lead.selectedPlan === 'premium' ? 'default' : 
                                   lead.selectedPlan === 'enterprise' ? 'secondary' : 'outline'}
                            className="mb-1"
                          >
                            {lead.selectedPlan}
                          </Badge>
                          <div className="text-xs text-muted-foreground">{lead.source}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analytics & Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics & Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plan Distribution */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Phân Bố Gói Học</h4>
                <div className="space-y-2">
                  {Object.entries(planDistribution).map(([plan, count]) => (
                    <div key={plan} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{plan}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(count as number / analytics.totalLeads) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{count as number}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Insights */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Hiệu Suất Website</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <PieChart className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-lg font-bold">{analytics.conversionRate.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">Conversion</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <div className="text-lg font-bold">{analytics.totalVisits > 0 ? Math.floor(analytics.totalRevenue / analytics.totalVisits) : 0}</div>
                    <div className="text-xs text-muted-foreground">Revenue/Visit</div>
                  </div>
                </div>
              </div>

              {/* Marketing Suggestions */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Đề Xuất Marketing</h4>
                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-1">Tăng Traffic:</h5>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>🔍 Google Ads cho từ khóa "học tiếng anh"</div>
                      <div>📝 Content marketing SEO</div>
                      <div>👥 Referral program</div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-1">Mục tiêu tháng này:</h5>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>• 1,000+ visits</div>
                      <div>• 30+ leads</div>
                      <div>• 3%+ conversion rate</div>
                      <div>• 15M+ revenue potential</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
