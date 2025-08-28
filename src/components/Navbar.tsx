import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Menu, 
  X, 
  BookOpen, 
  Users, 
  Award, 
  Phone,
  ChevronDown
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      // Navigate to home page first, then scroll
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <BookOpen className="w-8 h-8" />
            EnglishMaster Pro
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              Trang Chủ
            </Link>
            <Link 
              to="/courses" 
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              Khóa Học
            </Link>
            <button 
              onClick={() => scrollToSection("pricing")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              Học Phí
            </button>
            <Link 
              to="/admin/login" 
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
         Quản lý
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => scrollToSection("pricing")}
            >
              Học Thử Miễn Phí
            </Button>
            <Button 
              size="sm"
              className="bg-accent hover:bg-accent-hover text-accent-foreground"
              onClick={() => scrollToSection("pricing")}
            >
              Đăng Ký Ngay
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-border/50 shadow-medium">
            <div className="px-4 py-4 space-y-4">
              <Link 
                to="/" 
                className="block text-foreground hover:text-primary transition-smooth font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Trang Chủ
              </Link>
              <Link 
                to="/courses" 
                className="block text-foreground hover:text-primary transition-smooth font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Khóa Học
              </Link>
              <button 
                onClick={() => scrollToSection("pricing")}
                className="block w-full text-left text-foreground hover:text-primary transition-smooth font-medium"
              >
                Học Phí
              </button>
              <Link 
                to="/admin/login" 
                className="block text-foreground hover:text-primary transition-smooth font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Quản lý 
              </Link>
              
              <div className="pt-4 border-t border-border/50 space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    scrollToSection("pricing");
                    setIsMenuOpen(false);
                  }}
                >
                  Học Thử Miễn Phí
                </Button>
                <Button 
                  className="w-full bg-accent hover:bg-accent-hover text-accent-foreground"
                  onClick={() => {
                    scrollToSection("pricing");
                    setIsMenuOpen(false);
                  }}
                >
                  Đăng Ký Ngay
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;