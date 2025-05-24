import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

import {
  useAnnouncements,
  type Announcement,
} from "../mutations/useAnnouncements";
import {
  useUpcomingBirthdays,
  formatBirthDate,
} from "../mutations/useUpcomingBirthdays";
import { useUserStore } from "@/store/userStore";
import { BirthdayCard, type BirthdayCardProps } from "./birthday-card";
import {
  AnnouncementCard,
  type AnnouncementCardProps,
} from "./announcement-card";
import { MoreAnnouncementsCard } from "./more-announcements-card";
import { Error } from "@/features/error";

// main component
export const AnnouncementOverview = () => {
  const { role } = useUserStore();
  const userRole = role || "employee";

  // Fetch announcements
  const {
    data: announcementsData,
    isLoading: isLoadingAnnouncements,
    error: announcementsError,
  } = useAnnouncements(userRole);

  // Fetch upcoming birthdays
  const {
    data: birthdaysData,
    isLoading: isLoadingBirthdays,
    error: birthdaysError,
  } = useUpcomingBirthdays();

  const authorName = (announcement: Announcement) => {
    if (!announcement.created_by?.user_profiles) {
      return "N/A";
    }

    return (
      announcement.created_by?.user_profiles.first_name +
      " " +
      announcement.created_by?.user_profiles.last_name
    );
  };

  // Handle loading state
  const renderLoading = () => (
    <div className="space-y-4 py-2">
      <div className="flex gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
    </div>
  );

  // Handle error states
  const hasError = announcementsError || birthdaysError;
  if (hasError) {
    return <Error title="Failed to load announcements and birthdays" />;
  }

  // Limit announcements to 2 items
  const announcements = announcementsData?.data || [];
  const displayedAnnouncements = announcements.slice(0, 2);
  const remainingCount = Math.max(0, announcements.length - 2);

  return (
    <div className="w-full space-y-2 rounded-lg border p-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Birthday & Announcements</h2>
        <Link to="/employee/announcements">
          <Button variant="outline" size="sm">
            See all
          </Button>
        </Link>
      </div>
      <div className="bg-border -mx-2 h-px px-2" />
      <Tabs defaultValue="announcements" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-md">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="birthday">Upcoming Birthdays</TabsTrigger>
        </TabsList>

        {/* Announcements Tab */}
        <TabsContent value="announcements">
          {isLoadingAnnouncements ? (
            renderLoading()
          ) : announcements.length > 0 ? (
            <div className="space-y-2">
              {displayedAnnouncements.map((announcement) => {
                const announcementProps: AnnouncementCardProps = {
                  target: announcement.roles?.name || "All Employees",
                  date: new Date(announcement.created_at).toLocaleDateString(
                    "en-US",
                    { month: "long", day: "numeric" },
                  ),
                  title: announcement.title,
                  author_name: authorName(announcement),
                  author_avatar:
                    announcement.created_by?.user_profiles.profile_image,
                  content: announcement.body,
                };
                return (
                  <AnnouncementCard
                    key={announcement.id}
                    {...announcementProps}
                  />
                );
              })}

              {/* Show more announcements indicator if there are more than 2 */}
              {remainingCount > 0 && (
                <MoreAnnouncementsCard count={remainingCount} />
              )}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">No announcements found</p>
            </div>
          )}
        </TabsContent>

        {/* Birthdays Tab */}
        <TabsContent value="birthday">
          {isLoadingBirthdays ? (
            renderLoading()
          ) : birthdaysData?.data && birthdaysData.data.length > 0 ? (
            <div className="space-y-2">
              {birthdaysData.data.map((profile) => {
                const birthdayProps: BirthdayCardProps = {
                  date: formatBirthDate(profile.birth_date),
                  name: `${profile.first_name} ${profile.last_name}`,
                  avatarUrl: "", // Default avatar as example
                };
                return <BirthdayCard key={profile.id} {...birthdayProps} />;
              })}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">No upcoming birthdays</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
