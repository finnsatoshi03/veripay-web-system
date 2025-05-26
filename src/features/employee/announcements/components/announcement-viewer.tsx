import { Globe, Users, Megaphone, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatInitials } from "@/lib/helpers/formatters";
import { formatDistanceToNow, format } from "date-fns";
import type { AnnouncementData } from "./announcement-thread-card";

interface AnnouncementViewerProps {
  selectedAnnouncement: AnnouncementData | null;
}

export const AnnouncementViewer = ({
  selectedAnnouncement,
}: AnnouncementViewerProps) => {
  // Helper function to get author name
  const getAuthorName = (announcement: AnnouncementData) => {
    if (announcement.created_by?.user_profiles) {
      const profile = announcement.created_by.user_profiles;
      return `${profile.first_name} ${profile.last_name}`;
    }
    return "Unknown Author";
  };

  // Helper function to render formatted content
  const renderFormattedContent = (content: string) => {
    return (
      <div
        className="prose prose-sm prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground prose-blockquote:text-muted-foreground prose-code:text-foreground prose-pre:bg-muted max-w-none"
        dangerouslySetInnerHTML={{
          __html: content
            // Basic markdown-style formatting
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .replace(/__(.*?)__/g, "<u>$1</u>")
            .replace(/`(.*?)`/g, "<code>$1</code>")
            // Convert bullet points
            .replace(/\n• (.*?)(?=\n|$)/g, "<li>$1</li>")
            .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
            // Convert numbered lists
            .replace(/\n\d+\. (.*?)(?=\n|$)/g, "<li>$1</li>")
            .replace(/(<li>.*<\/li>)/s, "<ol>$1</ol>")
            // Convert line breaks
            .replace(/\n\n/g, "</p><p>")
            .replace(/\n/g, "<br>")
            // Wrap in paragraphs
            .replace(/^(.*)$/, "<p>$1</p>")
            // Clean up empty paragraphs
            .replace(/<p><\/p>/g, "")
            .replace(/<p><br><\/p>/g, ""),
        }}
      />
    );
  };

  return (
    <div className="bg-background flex-1">
      {selectedAnnouncement ? (
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="bg-card border-b p-6">
            <div className="space-y-4">
              {/* Scope Badge */}
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    selectedAnnouncement.scope === "global"
                      ? "default"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {selectedAnnouncement.scope === "global" ? (
                    <>
                      <Globe className="mr-1 size-3" />
                      Global Announcement
                    </>
                  ) : (
                    <>
                      <Users className="mr-1 size-3" />
                      For {selectedAnnouncement.roles?.name || "Role-specific"}
                    </>
                  )}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-2xl leading-tight font-bold">
                {selectedAnnouncement.title}
              </h1>

              {/* Author and Metadata */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage
                      src={
                        selectedAnnouncement.created_by?.user_profiles
                          ?.profile_image
                      }
                      alt={getAuthorName(selectedAnnouncement)}
                    />
                    <AvatarFallback>
                      {formatInitials(getAuthorName(selectedAnnouncement))}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="text-muted-foreground size-3" />
                      <span className="text-sm font-medium">
                        {getAuthorName(selectedAnnouncement)}
                      </span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <Clock className="size-3" />
                      <span>
                        Published{" "}
                        {formatDistanceToNow(
                          new Date(
                            new Date(
                              selectedAnnouncement.created_at,
                            ).getTime() +
                              8 * 60 * 60 * 1000,
                          ),
                          {
                            addSuffix: true,
                          },
                        )}
                      </span>
                      <span>•</span>
                      <span>
                        {format(
                          new Date(selectedAnnouncement.created_at),
                          "MMM dd, yyyy 'at' h:mm a",
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-4xl">
              {selectedAnnouncement.body ? (
                renderFormattedContent(selectedAnnouncement.body)
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Megaphone className="text-muted-foreground mx-auto mb-4 size-12" />
                    <p className="text-muted-foreground">
                      No content available
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-muted/30 border-t px-6 py-3">
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span>Posted by {getAuthorName(selectedAnnouncement)}</span>
                <span>
                  {format(
                    new Date(selectedAnnouncement.created_at),
                    "EEEE, MMMM dd, yyyy",
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>View only</span>
                <div className="bg-muted-foreground/40 size-1.5 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="max-w-md text-center">
            <Megaphone className="text-muted-foreground mx-auto mb-6 size-16" />
            <h2 className="mb-3 text-xl font-semibold">
              Select an announcement to read
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Choose any announcement from the sidebar to view its full content.
              You'll be able to see all details including author information and
              publication date.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
