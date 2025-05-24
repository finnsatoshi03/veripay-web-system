import { useState, useMemo } from "react";
import { AnnouncementsThreadList, AnnouncementViewer } from "./components";
import { useEmployeeAnnouncements } from "./mutations/useAnnouncements";
import { useUserStore } from "@/store/userStore";
import type { AnnouncementData } from "./components";

export default function EmployeeAnnouncements() {
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnnouncementData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Get user role from store
  const { role } = useUserStore();

  // Query for announcements
  const {
    data: announcementsData,
    isLoading: isLoadingAnnouncements,
    error: announcementsError,
  } = useEmployeeAnnouncements(role);

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
      const getAuthorName = (announcement: AnnouncementData) => {
        if (announcement.created_by?.user_profiles) {
          const profile = announcement.created_by.user_profiles;
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
  const handleAnnouncementSelect = (announcement: AnnouncementData) => {
    setSelectedAnnouncement(announcement);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex h-full w-full !overflow-hidden">
      {/* Left Panel - Announcements Thread List */}
      <AnnouncementsThreadList
        announcements={filteredAnnouncements}
        isLoading={isLoadingAnnouncements}
        error={announcementsError}
        selectedAnnouncement={selectedAnnouncement}
        onAnnouncementSelect={handleAnnouncementSelect}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {/* Right Panel - Announcement Viewer */}
      <AnnouncementViewer selectedAnnouncement={selectedAnnouncement} />
    </div>
  );
}
