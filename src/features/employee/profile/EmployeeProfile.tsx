import { ScrollArea } from "@/components/ui/scroll-area";

import { ProfileHeader } from "./components/profile-header";
import { ProfileInfo } from "./components/profile-info-form";
import { useUser } from "@/store/userStore";

export default function EmployeeProfile() {
  const { profile, employee, email, is_active } = useUser();

  const userData = {
    name: `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim(),
    email: email ?? "",
    is_active: is_active,
    phone: profile?.contact_number ?? "",
    address: profile?.address ?? "",
    gender: profile?.gender ?? "",
    department: employee?.department?.name ?? "",
    position: employee?.position?.title ?? "",
    created_at: employee?.created_at ?? "",
    birth_date: profile?.birth_date ?? "",
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
