import { Plus, Globe, Users, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "@/components/custom/search";
import { Skeleton } from "@/components/ui/skeleton";
import { AnnouncementCard } from "./announcement-card";
import type { AnnouncementWithDetails } from "@/services/hr/hr-announcement-service";

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
  return (
    <div className="border-border w-1/3 min-w-[400px] border-r">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-border border-b p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              <h1 className="text-xl font-semibold">Announcements</h1>
            </div>
            <Button onClick={onCreateNew} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New
            </Button>
          </div>

          {/* Search */}
          <Search
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full"
          />
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => onTabChange(value as typeof activeTab)}
        >
          <TabsList className="mx-4 mt-4 grid w-auto grid-cols-3">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="global" className="text-xs">
              <Globe className="mr-1 h-3 w-3" />
              Global
            </TabsTrigger>
            <TabsTrigger value="by role" className="text-xs">
              <Users className="mr-1 h-3 w-3" />
              By Role
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Announcement List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-muted-foreground">
                Failed to load announcements
              </p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-muted-foreground">
                {searchTerm.trim()
                  ? "No announcements found"
                  : "No announcements yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
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
    </div>
  );
};
