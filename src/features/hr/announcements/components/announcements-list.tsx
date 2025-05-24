import { Plus, Search, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AnnouncementCard } from "./announcement-card";
import type { AnnouncementWithDetails } from "@/services/hr/hr-announcement-service";
import { Skeleton } from "@/components/ui/skeleton";

interface AnnouncementsListProps {
  activeTab: "all" | "global" | "by role";
  onTabChange: (tab: "all" | "global" | "by role") => void;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  announcements: AnnouncementWithDetails[];
  isLoading: boolean;
  error: Error | null;
  selectedAnnouncement: AnnouncementWithDetails | null;
  onAnnouncementSelect: (announcement: AnnouncementWithDetails) => void;
  onAnnouncementEdit: (announcement: AnnouncementWithDetails) => void;
  onAnnouncementDelete: (id: number) => void;
  onCreateNew: () => void;
}

export const AnnouncementsList = ({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  announcements,
  isLoading,
  error,
  selectedAnnouncement,
  onAnnouncementSelect,
  onAnnouncementEdit,
  onAnnouncementDelete,
  onCreateNew,
}: AnnouncementsListProps) => {
  // Get counts for badges
  const globalCount = announcements.filter((a) => a.scope === "global").length;
  const roleCount = announcements.filter((a) => a.scope === "by role").length;

  // Handlers
  const handleFilterChange = (newFilter: "all" | "global" | "by role") => {
    onTabChange(newFilter);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onSearchChange({
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="bg-background flex h-full w-80 flex-col border-r">
      {/* Header */}
      <div className="border-b p-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Megaphone className="text-primary size-5" />
            <h2 className="text-lg font-semibold">Announcements</h2>
          </div>
          <Button onClick={onCreateNew} size="sm">
            <Plus className="size-4" />
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={onSearchChange}
            onKeyDown={handleSearchKeyDown}
            className="pl-9"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleFilterChange("all")}
            className="h-8 px-3"
          >
            All
            <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
              {announcements.length}
            </Badge>
          </Button>

          <Button
            variant={activeTab === "global" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleFilterChange("global")}
            className="h-8 px-3"
          >
            Global
            <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
              {globalCount}
            </Badge>
          </Button>

          <Button
            variant={activeTab === "by role" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleFilterChange("by role")}
            className="h-8 px-3"
          >
            Role
            <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
              {roleCount}
            </Badge>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="bg-muted space-y-3 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-8 rounded-lg" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-3/4" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Megaphone className="text-muted-foreground mb-4 size-12" />
            <h3 className="mb-2 text-lg font-medium">
              Error Loading Announcements
            </h3>
            <p className="text-muted-foreground text-sm">
              {error instanceof Error ? error.message : "Something went wrong"}
            </p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Megaphone className="text-muted-foreground mb-4 size-12" />
            <h3 className="mb-2 text-lg font-medium">
              {searchTerm ? "No matching announcements" : "No announcements"}
            </h3>
            <p className="text-muted-foreground text-sm">
              {searchTerm
                ? "Try adjusting your search or filter criteria"
                : "Create your first announcement to get started"}
            </p>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                isSelected={selectedAnnouncement?.id === announcement.id}
                onSelect={onAnnouncementSelect}
                onEdit={onAnnouncementEdit}
                onDelete={onAnnouncementDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
