import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Facebook, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Star,
  Award,
  Shield,
  Clock
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">EnglishMaster Pro</h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              Nền tảng học tiếng Anh online hàng đầu Việt Nam với phương pháp hiện đại và hiệu quả nhất.
            </p>
            
            <div className="flex items-center gap-4 mb-4">
              <Badge className="bg-white/20 text-white border-white/30">
                <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                4.9/5 Rating
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <Award className="w-4 h-4 mr-1" />
                Chứng nhận quốc tế
              </Badge>
            </div>

            <div className="flex gap-4">
              <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Khóa Học</h4>
            <ul className="space-y-3 text-white/80">
              <li><a href="#" className="hover:text-white transition-smooth">Tiếng Anh Giao Tiếp</a></li>
              <li><a href="#" className="hover:text-white transition-smooth">Business English</a></li>
              <li><a href="#" className="hover:text-white transition-smooth">IELTS Intensive</a></li>
              <li><a href="#" className="hover:text-white transition-smooth">TOEIC Preparation</a></li>
              <li><a href="#" className="hover:text-white transition-smooth">English for Kids</a></li>
              <li><a href="#" className="hover:text-white transition-smooth">Advanced Speaking</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hỗ Trợ</h4>
            <ul className="space-y-3 text-white/80">
              <li><a href="#" className="hover:text-white transition-smooth">Hướng dẫn sử dụng</a></li>
              <li><a href="#" className="hover:text-white transition-smooth">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="hover:text-white transition-smooth">Chính sách học phí</a></li>
              <li><a href="#" className="hover:text-white transition-smooth">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-white transition-smooth">Điều khoản sử dụng</a></li>
              <li>
                <a 
                  href="/dashboard" 
                  className="hover:text-white transition-smooth flex items-center gap-2"
                >
                  Admin Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên Hệ</h4>
            <div className="space-y-4 text-white/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p>Tầng 10, Tòa nhà FPT</p>
                  <p>Cầu Giấy, Hà Nội</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <a href="tel:1900123456" className="hover:text-white transition-smooth">
                  1900 123 456
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <a href="mailto:hello@englishmaster.pro" className="hover:text-white transition-smooth">
                  hello@englishmaster.pro
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" />
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="border-t border-white/20 pt-8 mb-8">
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Được Tin Tưởng Bởi</h4>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
              <div className="text-lg font-medium">FPT Software</div>
              <div className="text-lg font-medium">VinGroup</div>
              <div className="text-lg font-medium">Grab Vietnam</div>
              <div className="text-lg font-medium">Samsung</div>
              <div className="text-lg font-medium">Shopee</div>
              <div className="text-lg font-medium">Tiki</div>
            </div>
          </div>
        </div>

        {/* Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 text-accent" />
            <h5 className="font-semibold mb-1">Cam Kết Chất Lượng</h5>
            <p className="text-sm text-white/80">Hoàn tiền 100% nếu không hài lòng</p>
          </div>
          <div className="text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-accent" />
            <h5 className="font-semibold mb-1">Chứng Chỉ Quốc Tế</h5>
            <p className="text-sm text-white/80">Được công nhận bởi Cambridge & Oxford</p>
          </div>
          <div className="text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-accent" />
            <h5 className="font-semibold mb-1">Hỗ Trợ 24/7</h5>
            <p className="text-sm text-white/80">Đội ngũ tư vấn luôn sẵn sàng hỗ trợ</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-6 text-center text-white/80">
          <p className="mb-2">
            © 2024 EnglishMaster Pro. All rights reserved.
          </p>
          <p className="text-sm">
            Website được phát triển bằng <span className="text-accent">React + TypeScript</span> 
            {' '}với mục đích demo cho bài kiểm tra Fullstack Developer
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;