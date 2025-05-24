import { Plus, Globe, Users, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnnouncementWithDetails } from "@/services/hr/hr-announcement-service";

interface AnnouncementContentProps {
  selectedAnnouncement: AnnouncementWithDetails | null;
  onEdit: (announcement: AnnouncementWithDetails) => void;
  onDelete: (id: number) => void;
  onCreateNew: () => void;
}

export const AnnouncementContent = ({
  selectedAnnouncement,
  onEdit,
  onDelete,
  onCreateNew,
}: AnnouncementContentProps) => {
  // Render formatted content
  const renderFormattedContent = (content: string) => {
    return (
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{
          __html: content
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .replace(/__(.*?)__/g, "<u>$1</u>")
            .replace(/\n• (.*?)(?=\n|$)/g, "<li>$1</li>")
            .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
            .replace(/\n/g, "<br>"),
        }}
      />
    );
  };

  const getAuthorName = (announcement: AnnouncementWithDetails) => {
    if (announcement.created_by_profile?.user_profiles) {
      const profile = announcement.created_by_profile.user_profiles;
      return `${profile.first_name} ${profile.last_name}`;
    }
    return "Unknown Author";
  };

  return (
    <div className="flex-1">
      {selectedAnnouncement ? (
        <div className="flex h-full flex-col">
          {/* Content Header */}
          <div className="border-border border-b p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {selectedAnnouncement.scope === "global" ? (
                    <Globe className="h-4 w-4" />
                  ) : (
                    <Users className="h-4 w-4" />
                  )}
                  <span className="text-muted-foreground text-sm">
                    {selectedAnnouncement.scope === "global"
                      ? "Global Announcement"
                      : `For ${selectedAnnouncement.roles?.name || "Role-specific"}`}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(selectedAnnouncement)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(selectedAnnouncement.id)}
                >
                  Delete
                </Button>
              </div>
            </div>

            <h1 className="text-2xl font-bold">{selectedAnnouncement.title}</h1>

            <div className="text-muted-foreground mt-2 text-sm">
              By {getAuthorName(selectedAnnouncement)} •{" "}
              {new Date(selectedAnnouncement.created_at).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )}
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderFormattedContent(selectedAnnouncement.body)}
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <Megaphone className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h2 className="text-muted-foreground mb-2 text-lg font-medium">
              Select an announcement
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">
              Choose an announcement from the list to view its content
            </p>
            <Button onClick={onCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Announcement
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
