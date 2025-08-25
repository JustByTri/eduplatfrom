import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  Headphones, 
  MessageCircle, 
  Award, 
  Clock, 
  Smartphone,
  Users,
  Target,
  Video
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Chương Trình Cá Nhân Hóa",
      description: "AI phân tích trình độ và tạo lộ trình học phù hợp riêng cho bạn"
    },
    {
      icon: Headphones,
      title: "Luyện Nghe Nói Tự Nhiên",
      description: "Công nghệ nhận diện giọng nói giúp cải thiện phát âm như người bản xứ"
    },
    {
      icon: MessageCircle,
      title: "Giao Tiếp Thực Tế",
      description: "Hàng ngàn tình huống giao tiếp trong công việc và đời sống"
    },
    {
      icon: Video,
      title: "Live Class Hàng Ngày",
      description: "Tham gia lớp học trực tuyến với giáo viên bản xứ mỗi ngày"
    },
    {
      icon: Clock,
      title: "Học Mọi Lúc Mọi Nơi",
      description: "Chỉ cần 30 phút/ngày, học được trên điện thoại, máy tính"
    },
    {
      icon: Target,
      title: "Mục Tiêu Rõ Ràng",
      description: "Theo dõi tiến độ chi tiết, đạt được mục tiêu từng tuần"
    },
    {
      icon: Award,
      title: "Chứng Chỉ Quốc Tế",
      description: "Nhận chứng chỉ được công nhận bởi các doanh nghiệp hàng đầu"
    },
    {
      icon: Users,
      title: "Cộng Đồng Học Tập",
      description: "Kết nối với 10,000+ học viên, thảo luận và học hỏi lẫn nhau"
    },
    {
      icon: Smartphone,
      title: "Ứng Dụng Di Động",
      description: "App được thiết kế tối ưu, học offline khi không có mạng"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Tại Sao Chọn <span className="text-primary">EnglishMaster Pro?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Phương pháp học tiếng Anh hiện đại nhất, được thiết kế đặc biệt cho người Việt Nam
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-medium transition-smooth border-border/50 hover:border-primary/30 cursor-pointer transform hover:-translate-y-2"
            >
              <CardContent className="p-6">
                <div className="mb-4 w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-bounce">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-smooth">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats section */}
        <div className="mt-20 bg-gradient-primary rounded-2xl p-8 md:p-12 text-white">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Con Số Ấn Tượng
            </h3>
            <p className="text-xl opacity-90">
              Kết quả thực tế từ hàng nghìn học viên
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
              <div className="text-lg opacity-90">Học viên thành công</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
              <div className="text-lg opacity-90">Tỷ lệ hài lòng</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">6</div>
              <div className="text-lg opacity-90">Tháng thành thạo</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-90">Hỗ trợ học viên</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;