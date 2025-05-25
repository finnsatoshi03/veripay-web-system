import { formatDistanceToNow } from "date-fns";
import { Globe, Users, MessageSquare, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatInitials } from "@/lib/helpers/formatters";

// Type definition for announcement data structure
export interface AnnouncementData {
  id: number;
  title: string;
  body: string;
  scope: "global" | "by role";
  created_at: string;
  roles?: {
    name: string;
  } | null;
  created_by?: {
    user_profiles?: {
      first_name: string;
      last_name: string;
      profile_image?: string;
    };
  } | null;
}

interface AnnouncementThreadCardProps {
  announcement: AnnouncementData;
  isSelected?: boolean;
  onSelect: (announcement: AnnouncementData) => void;
  isPinned?: boolean;
}

export const AnnouncementThreadCard = ({
  announcement,
  isSelected = false,
  onSelect,
  isPinned = false,
}: AnnouncementThreadCardProps) => {
  // Helper function to get author name
  const getAuthorName = () => {
    if (announcement.created_by?.user_profiles) {
      const profile = announcement.created_by.user_profiles;
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
  const handleClick = () => {
    onSelect(announcement);
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
        "bg-card hover:bg-accent/50 group cursor-pointer rounded-lg border p-4 transition-all duration-200",
        isSelected && "ring-primary bg-accent/30 ring-2",
        isPinned && "border-primary/30 bg-primary/5",
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View announcement: ${announcement.title}`}
    >
      <div className="space-y-3">
        {/* Thread Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Author Avatar */}
            <Avatar className="size-8 rounded-lg">
              <AvatarImage
                src={announcement.created_by?.user_profiles?.profile_image}
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

          {/* Thread Icon */}
          <MessageSquare className="text-muted-foreground size-4" />
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
            <span>Click to view full announcement</span>
          </div>

          {/* Read indicator */}
          <div className="opacity-0 transition-opacity group-hover:opacity-100">
            <div className="bg-primary/20 size-2 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
