import { formatDistanceToNow } from "date-fns";
import {
  Globe,
  Users,
  Edit,
  Trash2,
  MoreVertical,
  MessageSquare,
  Pin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { AnnouncementWithDetails } from "@/services/hr/hr-announcement-service";
import { formatInitials } from "@/lib/helpers/formatters";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  // Helper function to get author name
  const getAuthorName = () => {
    if (announcement.created_by_profile?.user_profiles) {
      const profile = announcement.created_by_profile.user_profiles;
      return `${profile.first_name} ${profile.last_name}`;
    }
    return "Unknown Author";
  };

  // Helper function to strip HTML tags for preview text
  const stripHtmlTags = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  // Get preview text without HTML formatting
  const getPreviewText = () => {
    if (!announcement.body) return "No content";
    const plainText = stripHtmlTags(announcement.body);
    return plainText.trim() || "No content";
  };

  // Handlers
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

  const isPinned = announcement.scope === "global";

  return (
    <div
      className={cn(
        "bg-card hover:bg-accent/50 group cursor-pointer rounded-lg border p-4 transition-all duration-200",
        isSelected && "ring-primary bg-accent/30 ring-2",
        isPinned && "border-primary/30 bg-primary/5",
      )}
      onClick={() => onSelect(announcement)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Select announcement: ${announcement.title}`}
    >
      <div className="space-y-3">
        {/* Thread Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Author Avatar */}
            <Avatar className="size-8 rounded-lg">
              <AvatarImage
                src={
                  announcement.created_by_profile?.user_profiles?.profile_image
                }
                alt={getAuthorName()}
              />
              <AvatarFallback className="rounded-lg text-xs font-medium">
                {formatInitials(getAuthorName())}
              </AvatarFallback>
            </Avatar>

            {/* Author and Metadata */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{getAuthorName()}</span>
                {isPinned && <Pin className="text-primary size-3" />}
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span>
                  {formatDistanceToNow(
                    new Date(
                      new Date(announcement.created_at).getTime() +
                        8 * 60 * 60 * 1000,
                    ),
                    {
                      addSuffix: true,
                    },
                  )}
                </span>
                <span>•</span>
                <Badge
                  variant={
                    announcement.scope === "global" ? "default" : "secondary"
                  }
                  className="h-4 text-xs"
                >
                  {announcement.scope === "global" ? (
                    <>
                      <Globe className="mr-1 size-2.5" />
                      Global
                    </>
                  ) : (
                    <>
                      <Users className="mr-1 size-2.5" />
                      {announcement.roles?.name || "Role-specific"}
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="hover:bg-accent cursor-pointer rounded-md opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="size-4" />
                <span className="sr-only">Open announcement menu</span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-fit p-1">
              <button
                onClick={handleEdit}
                className="hover:bg-accent flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm"
              >
                <Edit className="size-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-destructive hover:bg-accent flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm"
              >
                <Trash2 className="size-4" />
                Delete
              </button>
            </PopoverContent>
          </Popover>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-base leading-tight font-semibold">
          {announcement.title}
        </h3>

        {/* Preview Text */}
        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
          {getPreviewText()}
        </p>

        {/* Thread Footer */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <MessageSquare className="size-3" />
            <span>Click to view and edit</span>
          </div>

          {/* Management indicator */}
          <div className="opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex items-center gap-1">
              <Edit className="text-primary/60 size-3" />
              <div className="bg-primary/20 size-2 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
