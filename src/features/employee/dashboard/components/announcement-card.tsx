import { Globe, Users, MessageSquare, Pin } from "lucide-react";
import { formatInitials } from "@/lib/helpers/formatters";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface AnnouncementCardProps {
  target: string;
  date: string;
  title: string;
  author_avatar?: string;
  author_name: string;
  content: string;
  onClick?: () => void;
}

export const AnnouncementCard = ({
  target,
  date,
  title,
  author_avatar,
  author_name,
  content,
  onClick,
}: AnnouncementCardProps) => {
  // Helper function to strip HTML tags for preview text
  const stripHtmlTags = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  // Get preview text without HTML formatting
  const getPreviewText = () => {
    if (!content) return "No content";
    const plainText = stripHtmlTags(content);
    return plainText.trim() || "No content";
  };

  // Check if announcement is global
  const isGlobal = target.toLowerCase() === "all employees";
  const isPinned = isGlobal;

  // Parse date for better formatting
  const formatDate = (dateString: string) => {
    try {
      const parsedDate = new Date(dateString);
      return formatDistanceToNow(parsedDate, { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  // Handlers
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
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
        "bg-card group rounded-lg border p-4 transition-all duration-200",
        isPinned && "border-primary/30 bg-primary/5",
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View announcement: ${title}`}
    >
      <div className="space-y-3">
        {/* Thread Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Author Avatar */}
            <Avatar className="size-8 rounded-lg">
              <AvatarImage src={author_avatar} alt={author_name} />
              <AvatarFallback className="rounded-lg text-xs font-medium">
                {formatInitials(author_name)}
              </AvatarFallback>
            </Avatar>

            {/* Author and Metadata */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{author_name}</span>
                {isPinned && <Pin className="text-primary size-3" />}
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span>{formatDate(date)}</span>
                <span>•</span>
                <Badge
                  variant={isGlobal ? "default" : "secondary"}
                  className="h-4 text-xs"
                >
                  {isGlobal ? (
                    <>
                      <Globe className="mr-1 size-2.5" />
                      Global
                    </>
                  ) : (
                    <>
                      <Users className="mr-1 size-2.5" />
                      {target}
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
          {title}
        </h3>

        {/* Preview Text */}
        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
          {getPreviewText()}
        </p>
      </div>
    </div>
  );
};
