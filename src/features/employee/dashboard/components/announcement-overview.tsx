import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BirthdayCard, type BirthdayCardProps } from "./birthday-card";
import {
  AnnouncementCard,
  type AnnouncementCardProps,
} from "./announcement-card";

// main component
export const AnnouncementOverview = () => {
  // sample data
  const announcementData: AnnouncementCardProps = {
    target: "Employees",
    date: "July 1",
    title: "Title",
    author: "John Doe",
    department: "HR Department",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  };

  const birthdayData: BirthdayCardProps = {
    date: "May 1",
    name: "HR Someone",
    avatarUrl: "https://github.com/shadcn.png",
  };

  return (
    <div className="w-full space-y-2 rounded-lg border p-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Birthday & Announcements</h2>
        <Button variant="outline" size="sm">
          See all
        </Button>
      </div>
      <div className="bg-border -mx-2 h-px px-2" />
      <Tabs defaultValue="announcements" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-md">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="birthday">Upcoming Birthdays</TabsTrigger>
        </TabsList>
        <TabsContent value="announcements">
          <AnnouncementCard {...announcementData} />
        </TabsContent>
        <TabsContent value="birthday">
          <BirthdayCard {...birthdayData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
