import { ScrollArea } from "@/components/ui/scroll-area";

import { ProfileHeader } from "./components/profile-header";
import { ProfileInfo } from "./components/profile-info";

export default function EmployeeProfile() {
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    is_active: true,
    phone: "+1234567890",
    address: "123 Main St, Anytown, USA",
    city: "Anytown",
    state: "CA",
    zip: "12345",
    gender: "Male",
    department: "IT",
    position: "Software Engineer",
    created_at: "2024-03-02T10:23:21",
    birth_date: "1990-01-01T10:23:21",
  };

  return (
    <div className="flex h-full flex-col items-center gap-4 !overflow-hidden">
      <ProfileHeader userData={userData} />

      <ScrollArea className="mt-4 min-h-0 w-full flex-1 overflow-auto">
        <ProfileInfo userData={userData} />
      </ScrollArea>
    </div>
  );
}
