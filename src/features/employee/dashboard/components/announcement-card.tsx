import { Calendar1, Globe, Users } from "lucide-react";

import { formatInitials } from "@/lib/helpers/formatters";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface AnnouncementCardProps {
  target: string;
  date: string;
  title: string;
  author: string;
  author_avatar?: string;
  author_name: string;
  content: string;
}

export const AnnouncementCard = ({
  target,
  date,
  title,
  author,
  author_avatar,
  author_name,
  content,
}: AnnouncementCardProps) => {
  const stripHtmlTags = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const getPreviewText = () => {
    if (!content) return "No content";

    // Strip HTML tags for clean preview text
    const plainText = stripHtmlTags(content);
    return plainText.trim() || "No content";
  };

  const isGlobal = target.toLowerCase() === "all employees";

  return (
    <div className="bg-input/80 space-y-2 rounded-md p-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={isGlobal ? "default" : "secondary"}>
            {isGlobal ? (
              <>
                <Globe className="mr-1 h-3 w-3" />
                Global
              </>
            ) : (
              <>
                <Users className="mr-1 h-3 w-3" />
                {target}
              </>
            )}
          </Badge>
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <Calendar1 className="h-3 w-3" />
            {date}
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="line-clamp-2 leading-tight font-semibold">{title}</h3>

      {/* Preview of body */}
      <p className="text-muted-foreground line-clamp-2 text-sm">
        {getPreviewText()}
      </p>

      {/* Author */}
      <div className="flex items-center gap-2 text-xs">
        <Avatar className="size-5 rounded-md">
          <AvatarImage src={author_avatar} />
          <AvatarFallback className="rounded-md text-xs">
            {formatInitials(author)}
          </AvatarFallback>
        </Avatar>
        <span className="text-muted-foreground">By {author_name}</span>
      </div>
    </div>
  );
};
