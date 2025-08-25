import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Activity
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
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState({
    totalVisits: 0,
    totalLeads: 0,
    totalRevenue: 0,
    conversionRate: 0
  });

  useEffect(() => {
    // Load data from localStorage
    const loadData = () => {
      const storedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
      setLeads(storedLeads);

      const totalVisits = parseInt(localStorage.getItem('totalVisits') || '0');
      const totalLeads = storedLeads.length;
      const totalRevenue = totalLeads * 599000; // Average plan price
      const conversionRate = totalVisits > 0 ? (totalLeads / totalVisits) * 100 : 0;

      setAnalytics({
        totalVisits,
        totalLeads,
        totalRevenue,
        conversionRate
      });
    };

    loadData();
    
    // Update every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

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
  };

  const planDistribution = leads.reduce((acc: any, lead) => {
    acc[lead.selectedPlan] = (acc[lead.selectedPlan] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">EnglishMaster Pro Analytics & Lead Management</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={exportLeads} className="bg-primary hover:bg-primary-dark">
              <Download className="w-4 h-4 mr-2" />
              Export Leads
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Về Trang Chủ
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Lượt Truy Cập</CardTitle>
              <Eye className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalVisits.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Unique visitors to landing page
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Leads</CardTitle>
              <Users className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{analytics.totalLeads}</div>
              <p className="text-xs text-muted-foreground">
                Registered prospects
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doanh Thu Ước Tính</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{formatRevenue(analytics.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                Potential revenue from leads
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{analytics.conversionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Visitors to leads conversion
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lead List */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Danh Sách Leads ({leads.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leads.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Chưa có leads nào. Hãy chia sẻ landing page để thu hút khách hàng tiềm năng!
                  </p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {leads.slice().reverse().map((lead, index) => (
                      <div key={index} className="border border-border/50 rounded-lg p-4 hover:shadow-soft transition-smooth">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-foreground">{lead.name}</h4>
                          <Badge className={
                            lead.selectedPlan === 'premium' ? 'bg-primary/10 text-primary' :
                            lead.selectedPlan === 'enterprise' ? 'bg-accent/10 text-accent' :
                            'bg-muted text-muted-foreground'
                          }>
                            {lead.selectedPlan}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${lead.email}`} className="hover:text-primary transition-smooth">
                              {lead.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <a href={`tel:${lead.phone}`} className="hover:text-primary transition-smooth">
                              {lead.phone}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(lead.timestamp).toLocaleString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Analytics Panel */}
          <div className="space-y-6">
            {/* Plan Distribution */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Phân Bố Gói Học
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(planDistribution).length === 0 ? (
                  <p className="text-muted-foreground text-center">Chưa có dữ liệu</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(planDistribution).map(([plan, count]) => (
                      <div key={plan} className="flex justify-between items-center">
                        <span className="capitalize">{plan}</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            plan === 'premium' ? 'bg-primary' :
                            plan === 'enterprise' ? 'bg-accent' :
                            'bg-muted-foreground'
                          }`} />
                          <span className="font-medium">{count as number}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Thông Tin Hiệu Suất
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Conversion Rate</span>
                      <span className="text-sm font-medium">{analytics.conversionRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${Math.min(analytics.conversionRate * 10, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-sm space-y-2">
                    <h4 className="font-medium text-foreground">Đề xuất tối ưu:</h4>
                    <ul className="text-muted-foreground space-y-1">
                      {analytics.conversionRate < 2 && (
                        <li>• Cải thiện CTA và form đăng ký</li>
                      )}
                      {analytics.totalVisits < 100 && (
                        <li>• Tăng traffic qua SEO/Ads</li>
                      )}
                      <li>• A/B test các headlines</li>
                      <li>• Thêm social proof</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Marketing Recommendations */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Chiến Lược Marketing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-3">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Kênh nên phát triển:</h4>
                    <div className="space-y-2 text-muted-foreground">
                      <div>📱 Facebook/Instagram Ads</div>
                      <div>🔍 Google Ads cho từ khóa "học tiếng anh"</div>
                      <div>📝 Content marketing SEO</div>
                      <div>👥 Referral program</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Mục tiêu tháng này:</h4>
                    <div className="space-y-1 text-muted-foreground">
                      <div>• 1,000+ visits</div>
                      <div>• 30+ leads</div>
                      <div>• 3%+ conversion rate</div>
                      <div>• 15M+ revenue potential</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;