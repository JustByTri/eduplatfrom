import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  BookOpen,
  Grid3x3,
  List,
  SlidersHorizontal
} from "lucide-react";
import CourseCard from "@/components/CourseCard";
import Pagination from "@/components/Pagination";

// Import course images
import courseBusiness from "@/assets/course-business.jpg";
import courseIelts from "@/assets/course-ielts.jpg";
import coursePronunciation from "@/assets/course-pronunciation.jpg";
import courseConversation from "@/assets/course-conversation.jpg";
import heroImage from "@/assets/hero-learning.jpg";

const Courses = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const coursesPerPage = 6;

  // Mock data cho courses
  const allCourses = [
    {
      id: 1,
      title: "Business English Communication - Giao tiếp tiếng Anh công sở chuyên nghiệp",
      instructor: "Mr. John Smith",
      rating: 4.9,
      reviewCount: 1250,
      duration: "8 tuần",
      students: 5420,
      level: "Intermediate",
      price: "899,000đ",
      originalPrice: "1,799,000đ",
      image: courseBusiness,
      category: "Business English",
      features: ["30+ video bài học", "100+ bài tập thực hành", "Live session hàng tuần", "Chứng chỉ quốc tế"],
      isPopular: true,
      discount: "50%"
    },
    {
      id: 2,
      title: "IELTS Intensive - Luyện thi IELTS cấp tốc đạt band 7.0+",
      instructor: "Ms. Sarah Wilson",
      rating: 4.8,
      reviewCount: 890,
      duration: "12 tuần",
      students: 3240,
      level: "Advanced",
      price: "1,299,000đ",
      originalPrice: "2,599,000đ",
      image: courseIelts,
      category: "Test Preparation",
      features: ["Mock tests hàng tuần", "Speaking 1-on-1", "Writing correction", "Strategy sessions"],
      discount: "50%"
    },
    {
      id: 3,
      title: "English Pronunciation Mastery - Phát âm chuẩn như người bản xứ",
      instructor: "Mr. David Brown",
      rating: 4.7,
      reviewCount: 654,
      duration: "6 tuần",
      students: 2180,
      level: "Beginner",
      price: "599,000đ",
      originalPrice: "1,199,000đ",
      image: coursePronunciation,
      category: "Pronunciation",
      features: ["AI voice training", "Phonetic exercises", "Recording practice", "Individual feedback"]
    },
    {
      id: 4,
      title: "Daily English Conversation - Giao tiếp hàng ngày tự tin",
      instructor: "Ms. Emma Johnson",
      rating: 4.9,
      reviewCount: 1420,
      duration: "10 tuần",
      students: 6800,
      level: "Beginner",
      price: "699,000đ",
      originalPrice: "1,399,000đ",
      image: courseConversation,
      category: "Conversation",
      features: ["Daily scenarios", "Role-play exercises", "Group practice", "Cultural insights"],
      isPopular: true
    },
    {
      id: 5,
      title: "TOEIC Preparation - Luyện thi TOEIC đạt 900+ điểm",
      instructor: "Mr. Michael Lee",
      rating: 4.6,
      reviewCount: 567,
      duration: "8 tuần", 
      students: 1890,
      level: "Intermediate",
      price: "999,000đ",
      originalPrice: "1,999,000đ",
      image: heroImage,
      category: "Test Preparation",
      features: ["Full practice tests", "Listening strategies", "Reading comprehension", "Score tracking"]
    },
    {
      id: 6,
      title: "English Grammar Foundation - Nền tảng ngữ pháp vững chắc",
      instructor: "Ms. Lisa Parker",
      rating: 4.5,
      reviewCount: 789,
      duration: "6 tuần",
      students: 2340,
      level: "Beginner",
      price: "499,000đ",
      originalPrice: "999,000đ",
      image: heroImage,
      category: "Grammar",
      features: ["Interactive exercises", "Grammar checker", "Practice quizzes", "Progress tracking"]
    },
    {
      id: 7,
      title: "Advanced Business Writing - Viết email & báo cáo chuyên nghiệp",
      instructor: "Mr. Robert Taylor",
      rating: 4.8,
      reviewCount: 445,
      duration: "4 tuần",
      students: 1200,
      level: "Advanced",
      price: "799,000đ",
      originalPrice: "1,599,000đ",
      image: courseBusiness,
      category: "Business English",
      features: ["Email templates", "Report writing", "Presentation skills", "Professional vocabulary"]
    },
    {
      id: 8,
      title: "English for Travel - Tiếng Anh du lịch thực tế",
      instructor: "Ms. Jenny White",
      rating: 4.7,
      reviewCount: 623,
      duration: "5 tuần",
      students: 1850,
      level: "Intermediate",
      price: "649,000đ",
      originalPrice: "1,299,000đ",
      image: courseConversation,
      category: "Travel English",
      features: ["Travel scenarios", "Airport English", "Hotel bookings", "Emergency situations"]
    },
    {
      id: 9,
      title: "Kids English Fun - Tiếng Anh vui nhộn cho trẻ em 6-12 tuổi",
      instructor: "Ms. Anna Green",
      rating: 4.9,
      reviewCount: 890,
      duration: "12 tuần",
      students: 3450,
      level: "Beginner",
      price: "799,000đ",
      originalPrice: "1,599,000đ",
      image: courseConversation,
      category: "Kids English",
      features: ["Interactive games", "Cartoon videos", "Song learning", "Parent dashboard"],
      isPopular: true
    },
    {
      id: 10,
      title: "Medical English - Tiếng Anh chuyên ngành y tế",
      instructor: "Dr. James Wilson",
      rating: 4.6,
      reviewCount: 234,
      duration: "6 tuần",
      students: 890,
      level: "Advanced",
      price: "1,199,000đ",
      originalPrice: "2,399,000đ",
      image: heroImage,
      category: "Specialized English",
      features: ["Medical terminology", "Patient communication", "Research papers", "Case studies"]
    },
    {
      id: 11,
      title: "English Job Interview Mastery - Phỏng vấn xin việc tự tin",
      instructor: "Mr. Kevin Martinez",
      rating: 4.8,
      reviewCount: 567,
      duration: "3 tuần",
      students: 1670,
      level: "Intermediate",
      price: "599,000đ",
      originalPrice: "1,199,000đ",
      image: courseBusiness,
      category: "Career English",
      features: ["Mock interviews", "Resume writing", "Common questions", "Confidence building"]
    },
    {
      id: 12,
      title: "Academic English Writing - Viết luận văn & nghiên cứu khoa học",
      instructor: "Prof. Elizabeth Davis",
      rating: 4.7,
      reviewCount: 345,
      duration: "8 tuần",
      students: 1120,
      level: "Advanced",
      price: "1,099,000đ",
      originalPrice: "2,199,000đ",
      image: courseIelts,
      category: "Academic English",
      features: ["Research writing", "Citation styles", "Thesis structure", "Peer reviews"]
    }
  ];

  // Filter courses based on search and filters
  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
      
      return matchesSearch && matchesLevel && matchesCategory;
    });
  }, [searchTerm, selectedLevel, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage);

  // Reset to page 1 when filters change
  const handleFilterChange = (type: string, value: string) => {
    setCurrentPage(1);
    if (type === "level") setSelectedLevel(value);
    if (type === "category") setSelectedCategory(value);
  };

  const categories = ["all", "Business English", "Test Preparation", "Conversation", "Pronunciation", "Grammar", "Travel English", "Kids English", "Specialized English", "Career English", "Academic English"];
  const levels = ["all", "Beginner", "Intermediate", "Advanced"];

  return (
    <div className="min-h-screen bg-muted/30 py-8 pt-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Khóa Học <span className="text-primary">Tiếng Anh</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Khám phá hàng trăm khóa học chất lượng cao được thiết kế bởi các chuyên gia
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Tìm Kiếm & Lọc Khóa Học
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search Input */}
              <div>
                <Input
                  placeholder="Tìm khóa học, giảng viên..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full"
                />
              </div>

              {/* Level Filter */}
              <div>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={selectedLevel}
                  onChange={(e) => handleFilterChange("level", e.target.value)}
                >
                  <option value="all">Tất cả trình độ</option>
                  {levels.slice(1).map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={selectedCategory}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                >
                  <option value="all">Tất cả danh mục</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Hiển thị {startIndex + 1}-{Math.min(startIndex + coursesPerPage, filteredCourses.length)} 
                của {filteredCourses.length} khóa học
              </span>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Sắp xếp theo độ phổ biến</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Grid/List */}
        {filteredCourses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Không tìm thấy khóa học</h3>
              <p className="text-muted-foreground">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm khóa học phù hợp
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className={`grid gap-8 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {paginatedCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center border-border/50">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">12+</div>
              <div className="text-sm text-muted-foreground">Khóa học chất lượng</div>
            </CardContent>
          </Card>
          <Card className="text-center border-border/50">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-secondary mb-2">25,000+</div>
              <div className="text-sm text-muted-foreground">Học viên đã tham gia</div>
            </CardContent>
          </Card>
          <Card className="text-center border-border/50">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-accent mb-2">4.8</div>
              <div className="text-sm text-muted-foreground">Đánh giá trung bình</div>
            </CardContent>
          </Card>
          <Card className="text-center border-border/50">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-success mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Tỷ lệ hoàn thành</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Courses;