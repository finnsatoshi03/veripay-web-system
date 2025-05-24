import { formatDistanceToNow } from "date-fns";
import { Globe, Users, Edit, Trash2, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { AnnouncementWithDetails } from "@/services/hr/hr-announcement-service";

interface AnnouncementCardProps {
  announcement: AnnouncementWithDetails;
  isSelected?: boolean;
  onSelect: (announcement: AnnouncementWithDetails) => void;
  onEdit: (announcement: AnnouncementWithDetails) => void;
  onDelete: (id: number) => void;
}

export const AnnouncementCard = ({
  announcement,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
}: AnnouncementCardProps) => {
  const getAuthorName = () => {
    if (announcement.created_by_profile?.user_profiles) {
      const profile = announcement.created_by_profile.user_profiles;
      return `${profile.first_name} ${profile.last_name}`;
    }
    return "Unknown Author";
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(announcement);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(announcement.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(announcement);
    }
  };

  return (
    <div
      className={cn(
        "border-border hover:bg-muted/50 group cursor-pointer rounded-lg border p-4 transition-colors",
        isSelected && "bg-accent border-accent-foreground",
      )}
      onClick={() => onSelect(announcement)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Select announcement: ${announcement.title}`}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant={
                announcement.scope === "global" ? "default" : "secondary"
              }
            >
              {announcement.scope === "global" ? (
                <>
                  <Globe className="mr-1 h-3 w-3" />
                  Global
                </>
              ) : (
                <>
                  <Users className="mr-1 h-3 w-3" />
                  {announcement.roles?.name || "Role-specific"}
                </>
              )}
            </Badge>
            <span className="text-muted-foreground text-xs">
              {formatDistanceToNow(new Date(announcement.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Actions Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open announcement menu</span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="flex w-fit flex-col gap-2 p-1"
            >
              <button
                onClick={handleEdit}
                className="hover:bg-accent flex cursor-pointer items-center gap-2 px-3 py-1 text-sm"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-destructive focus:text-destructive hover:bg-accent flex cursor-pointer items-center gap-2 px-3 py-1 text-sm"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </button>
            </PopoverContent>
          </Popover>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 leading-tight font-semibold">
          {announcement.title}
        </h3>

        {/* Preview of body */}
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {announcement.body || "No content"}
        </p>

        {/* Author */}
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>By {getAuthorName()}</span>
        </div>
      </div>
    </div>
  );
};
