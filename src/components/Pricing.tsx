import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLeadSubmission } from "@/hooks/useAPI";
import PaymentModal from "@/components/PaymentModal";
import { 
  Check, 
  Crown, 
  Star, 
  Clock, 
  Users, 
  BookOpen,
  Headphones,
  Award,
  Smartphone
} from "lucide-react";

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { toast } = useToast();
  const { 
    submitLead, 
    isSubmitting, 
    success, 
    error,
    resetState 
  } = useLeadSubmission();

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "299,000",
      originalPrice: "599,000",
      duration: "/ tháng",
      popular: false,
      description: "Phù hợp cho người mới bắt đầu",
      features: [
        "50+ bài học cơ bản",
        "AI tutor hỗ trợ 24/7", 
        "Luyện phát âm với AI",
        "Ứng dụng mobile",
        "Chứng chỉ hoàn thành",
        "Hỗ trợ qua chat"
      ],
      color: "border-border"
    },
    {
      id: "premium",
      name: "Premium",
      price: "599,000",
      originalPrice: "1,199,000",
      duration: "/ tháng",
      popular: true,
      description: "Phổ biến nhất - Toàn bộ tính năng",
      features: [
        "200+ bài học chuyên sâu",
        "Live class hàng ngày",
        "1-on-1 với giáo viên bản xứ",
        "Lộ trình cá nhân hóa AI",
        "Cộng đồng học viên VIP",
        "Tài liệu Business English",
        "Mock interview IELTS/TOEIC",
        "Hỗ trợ ưu tiên 24/7"
      ],
      color: "border-primary shadow-medium"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "999,000", 
      originalPrice: "1,999,000",
      duration: "/ tháng",
      popular: false,
      description: "Dành cho doanh nghiệp và team",
      features: [
        "Tất cả tính năng Premium",
        "Training cho team (5-50 người)",
        "Customized curriculum",
        "Dedicated account manager",
        "Progress tracking dashboard",
        "Monthly performance report",
        "On-site training session",
        "24/7 premium support"
      ],
      color: "border-accent"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name || !phone) {
      toast({
        title: "Vui lòng điền đầy đủ thông tin",
        description: "Tất cả các trường đều bắt buộc",
        variant: "destructive"
      });
      return;
    }

    try {
      // Reset any previous state
      resetState();
      
      // Submit lead via API
      await submitLead({
        name,
        email, 
        phone,
        selected_plan: selectedPlan,
      });

      // Show payment modal after successful lead submission
      setShowPaymentModal(true);
      
    } catch (error) {
      // Error already handled by the hook
      console.error('Form submission error:', error);
    }
  };

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
            💰 Ưu đãi có hạn - Giảm 50%
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Chọn Gói Học Phù Hợp
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Đầu tư cho tương lai của bạn với mức phí hợp lý nhất thị trường
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative cursor-pointer transition-smooth hover:shadow-medium ${plan.color} ${
                plan.popular ? 'scale-105 z-10' : ''
              } ${selectedPlan === plan.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    <Crown className="w-4 h-4 mr-1" />
                    Phổ biến nhất
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <p className="text-muted-foreground">{plan.description}</p>
                
                <div className="mt-4">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-primary">
                      {plan.price}đ
                    </span>
                    <span className="text-lg text-muted-foreground">
                      {plan.duration}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground line-through mt-1">
                    {plan.originalPrice}đ
                  </div>
                  <Badge className="mt-2 bg-success/10 text-success border-success/20">
                    Tiết kiệm 50%
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Registration Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-strong border-primary/20">
            <CardHeader className="text-center">
              <div className="mb-4">
                <Badge className="bg-accent text-accent-foreground">
                  🎁 Học thử miễn phí 7 ngày
                </Badge>
              </div>
              <CardTitle className="text-3xl font-bold text-primary">
                Đăng Ký Ngay Hôm Nay
              </CardTitle>
              <p className="text-muted-foreground">
                Nhập thông tin để nhận ngay 7 ngày học thử miễn phí
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Họ và tên *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0901234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Gói đã chọn: {plans.find(p => p.id === selectedPlan)?.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Bạn có thể thay đổi gói học sau khi đăng ký
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-accent hover:bg-accent-hover text-accent-foreground font-semibold py-3 text-lg shadow-medium transition-smooth transform hover:scale-105"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang xử lý..." : "🚀 Bắt Đầu Học Thử Miễn Phí"}
                </Button>

                <p className="text-sm text-center text-muted-foreground">
                  Cam kết không spam. Bạn có thể hủy đăng ký bất cứ lúc nào.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Đánh giá 4.9/5</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>10,000+ học viên</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>Chứng chỉ quốc tế</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            // Reset form after payment modal closes
            setEmail("");
            setName("");
            setPhone("");
          }}
          selectedPlan={plans.find(p => p.id === selectedPlan) || plans[1]}
          leadData={{ name, email, phone }}
        />
      </div>
    </section>
  );
};

export default Pricing;