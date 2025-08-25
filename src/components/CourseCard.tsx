import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Clock, 
  Users, 
  Award, 
  PlayCircle,
  BookOpen,
  Headphones
} from "lucide-react";

interface Course {
  id: number;
  title: string;
  instructor: string;
  rating: number;
  reviewCount: number;
  duration: string;
  students: number;
  level: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  features: string[];
  isPopular?: boolean;
  discount?: string;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className="group hover:shadow-strong transition-smooth border-border/50 hover:border-primary/30 overflow-hidden">
      {/* Course Image */}
      <div className="relative overflow-hidden">
        <div 
          className="h-48 bg-cover bg-center bg-no-repeat transition-smooth group-hover:scale-105"
          style={{ backgroundImage: `url(${course.image})` }}
        />
        
        {/* Overlay with play button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
          <Button size="lg" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
            <PlayCircle className="w-6 h-6 mr-2" />
            Xem Demo
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {course.isPopular && (
            <Badge className="bg-accent text-accent-foreground">
              🔥 Phổ biến
            </Badge>
          )}
          {course.discount && (
            <Badge className="bg-success text-success-foreground">
              -{course.discount} OFF
            </Badge>
          )}
        </div>

        {/* Category */}
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className="bg-white/20 backdrop-blur-sm border-white/30 text-white">
            {course.category}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-4">
        {/* Rating & Reviews */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${
                    i < Math.floor(course.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-sm font-medium">{course.rating}</span>
            <span className="text-sm text-muted-foreground">({course.reviewCount})</span>
          </div>
          <Badge variant="outline" className={`text-xs ${
            course.level === 'Beginner' ? 'border-green-200 text-green-700' :
            course.level === 'Intermediate' ? 'border-yellow-200 text-yellow-700' :
            'border-red-200 text-red-700'
          }`}>
            {course.level}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-smooth line-clamp-2">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-sm text-muted-foreground">
          Giảng viên: <span className="font-medium">{course.instructor}</span>
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Course Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.students.toLocaleString()} học viên</span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {course.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
                {feature.includes('video') ? <PlayCircle className="w-3 h-3" /> :
                 feature.includes('bài tập') ? <BookOpen className="w-3 h-3" /> :
                 <Headphones className="w-3 h-3" />}
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              {course.price}
            </span>
            {course.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {course.originalPrice}
              </span>
            )}
          </div>
          <Button className="bg-primary hover:bg-primary-dark text-primary-foreground">
            Đăng Ký Ngay
          </Button>
        </div>

        {/* Certificate info */}
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
          <Award className="w-4 h-4 text-accent" />
          <span>Có chứng chỉ hoàn thành</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;