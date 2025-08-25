import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showText?: boolean;
}

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showText = true 
}: PaginationProps) => {
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, -1, totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, -1, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages];
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-border hover:bg-muted"
      >
        <ChevronLeft className="w-4 h-4" />
        {showText && <span className="ml-1 hidden sm:inline">Trước</span>}
      </Button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => (
          <div key={index}>
            {page === -1 ? (
              <div className="flex items-center justify-center w-10 h-10">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </div>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 p-0 ${
                  currentPage === page 
                    ? "bg-primary text-primary-foreground hover:bg-primary-dark" 
                    : "border-border hover:bg-muted"
                }`}
              >
                {page}
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Next button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-border hover:bg-muted"
      >
        {showText && <span className="mr-1 hidden sm:inline">Sau</span>}
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Page info */}
      {showText && (
        <span className="ml-4 text-sm text-muted-foreground hidden md:inline">
          Trang {currentPage} / {totalPages}
        </span>
      )}
    </div>
  );
};

export default Pagination;