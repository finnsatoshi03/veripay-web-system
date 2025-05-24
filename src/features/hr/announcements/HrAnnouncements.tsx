import { useState, useMemo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AnnouncementsList } from "./components/announcements-list";
import { AnnouncementContent } from "./components/announcement-content";
import { AnnouncementDialog } from "./components/announcement-dialog";
import {
  useHrAnnouncements,
  useDeleteAnnouncement,
} from "./mutations/useAnnouncements";
import type { AnnouncementWithDetails } from "@/services/hr/hr-announcement-service";
import { useUserStore } from "@/store/userStore";

export default function HrAnnouncements() {
  const [activeTab, setActiveTab] = useState<"all" | "global" | "by role">(
    "all",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnnouncementWithDetails | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<AnnouncementWithDetails | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<
    number | null
  >(null);

  const { id: userId } = useUserStore();

  // Queries
  const {
    data: announcementsData,
    isLoading: isLoadingAnnouncements,
    error: announcementsError,
  } = useHrAnnouncements(activeTab);

  const deleteMutation = useDeleteAnnouncement();

  // Filter announcements based on search term
  const filteredAnnouncements = useMemo(() => {
    if (!announcementsData?.data) return [];

    if (!searchTerm.trim()) {
      return announcementsData.data;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    return announcementsData.data.filter((announcement) => {
      const titleMatch = announcement.title
        .toLowerCase()
        .includes(lowercaseSearch);
      const bodyMatch = announcement.body
        .toLowerCase()
        .includes(lowercaseSearch);
      const getAuthorName = (announcement: AnnouncementWithDetails) => {
        if (announcement.created_by_profile?.user_profiles) {
          const profile = announcement.created_by_profile.user_profiles;
          return `${profile.first_name} ${profile.last_name}`;
        }
        return "Unknown Author";
      };
      const authorName = getAuthorName(announcement).toLowerCase();
      const authorMatch = authorName.includes(lowercaseSearch);
      const roleMatch = announcement.roles?.name
        ?.toLowerCase()
        .includes(lowercaseSearch);

      return titleMatch || bodyMatch || authorMatch || roleMatch;
    });
  }, [announcementsData?.data, searchTerm]);

  // Handlers
  const handleCreateNew = () => {
    setEditingAnnouncement(null);
    setDialogOpen(true);
  };

  const handleEdit = (announcement: AnnouncementWithDetails) => {
    setEditingAnnouncement(announcement);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setAnnouncementToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (announcementToDelete) {
      await deleteMutation.mutateAsync(announcementToDelete);
      setDeleteDialogOpen(false);
      setAnnouncementToDelete(null);

      // Clear selection if the deleted announcement was selected
      if (selectedAnnouncement?.id === announcementToDelete) {
        setSelectedAnnouncement(null);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (tab: "all" | "global" | "by role") => {
    setActiveTab(tab);
  };

  return (
    <div className="flex h-full w-full !overflow-hidden">
      {/* Left Panel - Announcement List */}
      <AnnouncementsList
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        announcements={filteredAnnouncements}
        isLoading={isLoadingAnnouncements}
        error={announcementsError}
        selectedAnnouncement={selectedAnnouncement}
        onAnnouncementSelect={setSelectedAnnouncement}
        onAnnouncementEdit={handleEdit}
        onAnnouncementDelete={handleDelete}
        onCreateNew={handleCreateNew}
      />

      {/* Right Panel - Announcement Content */}
      <AnnouncementContent
        selectedAnnouncement={selectedAnnouncement}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreateNew={handleCreateNew}
      />

      {/* Dialogs */}
      <AnnouncementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        announcement={editingAnnouncement}
        userId={userId || undefined}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this announcement? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
