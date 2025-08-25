import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Nguyễn Minh Tú",
      role: "Marketing Manager - FPT Software",
      company: "FPT",
      content: "Sau 4 tháng học với EnglishMaster Pro, tôi đã tự tin thuyết trình bằng tiếng Anh trước 100+ khách hàng quốc tế. Phương pháp học thực sự hiệu quả!",
      rating: 5,
      avatar: "👩‍💼",
      achievement: "Tăng lương 40% sau khóa học"
    },
    {
      name: "Lê Văn Hoàng",
      role: "Software Engineer - Grab",
      company: "Grab",
      content: "Là dân IT, tôi cần tiếng Anh để đọc tài liệu và giao tiếp với team quốc tế. EnglishMaster Pro giúp tôi từ mức sơ cấp lên trung cấp chỉ trong 5 tháng.",
      rating: 5,
      avatar: "👨‍💻",
      achievement: "Được promote lên Senior Developer"
    },
    {
      name: "Trần Thu Hương",
      role: "Business Analyst - VinGroup",
      company: "VinGroup",
      content: "Tôi từng học tiếng Anh 3 năm nhưng vẫn không nói được. Với EnglishMaster Pro, chỉ 6 tháng tôi đã có thể họp với đối tác nước ngoài một cách tự nhiên.",
      rating: 5,
      avatar: "👩‍💼",
      achievement: "Chuyển sang vị trí International BD"
    },
    {
      name: "Phạm Đức Anh",
      role: "Sales Director - Samsung",
      company: "Samsung",
      content: "Khóa học Business English của EnglishMaster Pro rất thực tế. Mình đã áp dụng ngay các kỹ năng negotiation và presentation vào công việc với kết quả tuyệt vời.",
      rating: 5,
      avatar: "👨‍💼",
      achievement: "Đạt 150% target sales Q3"
    },
    {
      name: "Ngô Thị Lan",
      role: "HR Manager - Shopee",
      company: "Shopee",
      content: "Điều tôi thích nhất là có thể học mọi lúc mọi nơi. Từ việc nghe podcast trên đường đi làm đến practice speaking với AI, mọi thứ đều rất tiện lợi và hiệu quả.",
      rating: 5,
      avatar: "👩‍💼",
      achievement: "Được headhunt sang công ty Fortune 500"
    },
    {
      name: "Đinh Văn Quân",
      role: "Product Manager - Tiki",
      company: "Tiki",
      content: "AI tutor của EnglishMaster Pro thông minh hơn tôi tưởng. Nó biết điểm yếu của tôi và tạo bài tập riêng. Sau 4 tháng, tôi đã pass được IELTS 7.5!",
      rating: 5,
      avatar: "👨‍💻",
      achievement: "IELTS 7.5 - chuẩn bị du học MBA"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-success text-success-foreground">
            ⭐ Đánh giá từ học viên
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Câu Chuyện Thành Công
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hàng nghìn học viên đã thay đổi cuộc sống với EnglishMaster Pro
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-strong transition-smooth border-border/50 hover:border-primary/20 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                <Quote className="w-8 h-8 text-primary/20" />
              </div>
              
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-muted-foreground mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                {/* Achievement badge */}
                <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
                  🎉 {testimonial.achievement}
                </Badge>

                {/* Author info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                    <div className="text-xs font-medium text-primary">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-8">
            Được tin tưởng bởi nhân viên từ các công ty hàng đầu
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold">FPT Software</div>
            <div className="text-2xl font-bold">VinGroup</div>
            <div className="text-2xl font-bold">Grab</div>
            <div className="text-2xl font-bold">Samsung</div>
            <div className="text-2xl font-bold">Shopee</div>
            <div className="text-2xl font-bold">Tiki</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;