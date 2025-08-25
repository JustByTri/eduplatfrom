import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  TrendingUp,
  Eye,
  Target,
  BarChart3,
  Activity
} from "lucide-react";

interface AnalyticsData {
  totalVisits: number;
  totalLeads: number;
  totalRevenue: number;
  conversionRate: number;
  todayVisits: number;
  todayLeads: number;
}

const Analytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisits: 0,
    totalLeads: 0,
    totalRevenue: 0,
    conversionRate: 0,
    todayVisits: 0,
    todayLeads: 0
  });

  useEffect(() => {
    // Increment visit counter when component mounts
    const incrementVisit = () => {
      const currentVisits = parseInt(localStorage.getItem('totalVisits') || '0');
      const newVisitCount = currentVisits + 1;
      localStorage.setItem('totalVisits', newVisitCount.toString());

      const today = new Date().toDateString();
      const todayVisitsKey = `visits_${today}`;
      const todayVisits = parseInt(localStorage.getItem(todayVisitsKey) || '0');
      localStorage.setItem(todayVisitsKey, (todayVisits + 1).toString());
    };

    // Only increment if not already visited today
    const lastVisit = localStorage.getItem('lastVisitDate');
    const today = new Date().toDateString();
    
    if (lastVisit !== today) {
      incrementVisit();
      localStorage.setItem('lastVisitDate', today);
    }

    // Load analytics data
    const loadAnalytics = () => {
      const totalVisits = parseInt(localStorage.getItem('totalVisits') || '0');
      const totalLeads = parseInt(localStorage.getItem('leadCount') || '0');
      
      // Simulate revenue (in real app, this would come from payment API)
      const leads = JSON.parse(localStorage.getItem('leads') || '[]');
      const totalRevenue = leads.length * 599000; // Assume average plan price
      
      const conversionRate = totalVisits > 0 ? (totalLeads / totalVisits) * 100 : 0;
      
      const today = new Date().toDateString();
      const todayVisits = parseInt(localStorage.getItem(`visits_${today}`) || '0');
      
      // Today's leads
      const todayLeads = leads.filter((lead: any) => {
        const leadDate = new Date(lead.timestamp).toDateString();
        return leadDate === today;
      }).length;

      setAnalytics({
        totalVisits,
        totalLeads,
        totalRevenue,
        conversionRate,
        todayVisits,
        todayLeads
      });
    };

    loadAnalytics();

    // Update analytics every 5 seconds
    const interval = setInterval(loadAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatRevenue = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const stats = [
    {
      title: "Tổng Lượt Truy Cập",
      value: analytics.totalVisits.toLocaleString(),
      icon: Eye,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: `+${analytics.todayVisits} hôm nay`
    },
    {
      title: "Tổng Leads",
      value: analytics.totalLeads.toLocaleString(),
      icon: UserPlus,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      change: `+${analytics.todayLeads} hôm nay`
    },
    {
      title: "Doanh Thu Ước Tính",
      value: formatRevenue(analytics.totalRevenue),
      icon: DollarSign,
      color: "text-accent",
      bgColor: "bg-accent/10",
      change: `Trung bình 599K/khóa`
    },
    {
      title: "Conversion Rate",
      value: `${analytics.conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
      change: analytics.conversionRate > 2 ? "Tốt" : "Cần cải thiện"
    }
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            📊 Analytics Dashboard
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Thống Kê Thời Gian Thực
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dữ liệu hiệu suất website và chuyển đổi leads được cập nhật tự động
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border/50 hover:shadow-medium transition-smooth">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Hiệu Suất Marketing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Traffic Quality</span>
                  <Badge variant={analytics.conversionRate > 2 ? "default" : "destructive"}>
                    {analytics.conversionRate > 2 ? "Tốt" : "Cần cải thiện"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Lead Generation</span>
                  <Badge variant={analytics.totalLeads > 10 ? "default" : "secondary"}>
                    {analytics.totalLeads > 10 ? "Đạt mục tiêu" : "Đang phát triển"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Revenue Potential</span>
                  <Badge className="bg-accent/10 text-accent">
                    {formatRevenue(analytics.totalRevenue)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-secondary" />
                Đề Xuất Tối Ưu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.conversionRate < 2 && (
                  <div className="text-sm">
                    <span className="font-medium text-foreground">Tăng Conversion Rate:</span>
                    <p className="text-muted-foreground">Cải thiện CTA và form đăng ký</p>
                  </div>
                )}
                {analytics.totalVisits < 100 && (
                  <div className="text-sm">
                    <span className="font-medium text-foreground">Tăng Traffic:</span>
                    <p className="text-muted-foreground">Chạy quảng cáo Facebook/Google</p>
                  </div>
                )}
                <div className="text-sm">
                  <span className="font-medium text-foreground">SEO:</span>
                  <p className="text-muted-foreground">Tối ưu từ khóa "học tiếng anh online"</p>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-foreground">Social Proof:</span>
                  <p className="text-muted-foreground">Thêm testimonial và case study</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Analytics;