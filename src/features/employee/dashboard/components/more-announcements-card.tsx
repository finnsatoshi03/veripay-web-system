import { Plus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MoreAnnouncementsCardProps {
  count: number;
}

export const MoreAnnouncementsCard = ({
  count,
}: MoreAnnouncementsCardProps) => {
  const navigate = useNavigate();

  // Handlers
  const handleClick = () => {
    navigate("/employee/announcements");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={cn(
        "group border-muted-foreground/30 cursor-pointer rounded-lg border-2 border-dashed p-2 transition-all duration-200",
        "hover:border-primary/50 hover:bg-primary/5",
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View ${count} more announcements`}
    >
      <div className="flex items-center justify-center space-y-2 text-center">
        <div className="text-muted-foreground group-hover:text-primary flex items-center gap-2 transition-colors">
          <Plus className="size-4" />
          <span className="text-sm font-medium">
            {count} more announcement{count !== 1 ? "s" : ""}
          </span>
          <ArrowRight className="size-4 transform transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};
