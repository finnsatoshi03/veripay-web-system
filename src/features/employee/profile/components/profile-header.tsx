import { useState } from "react";
import { ProfileImageSelector } from "@/components/custom/profile-image-selector";

import { formatInitials, formatMonthYear } from "@/lib/helpers/formatters";
import { cn } from "@/lib/utils";
import { Briefcase, Calendar1 } from "lucide-react";

export type UserData = {
  name: string;
  email: string;
  is_active: boolean;
  phone: string;
  address: string;
  gender: string;
  department: string;
  position: string;
  created_at: string;
  birth_date: string;
  profile_image?: string;
};

type ProfileHeaderProps = {
  userData: UserData;
};

export const ProfileHeader = ({ userData }: ProfileHeaderProps) => {
  const [profileImage, setProfileImage] = useState<string>(
    userData.profile_image || "",
  );
  const genderPronoun = userData.gender === "Male" ? "He/Him" : "She/Her";

  const handleImageChange = (imageUrl: string) => {
    setProfileImage(imageUrl);
  };

  return (
    <>
      {/* cover photo */}
      <div className="bg-primary relative h-[30vh] w-full rounded-lg">
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <ProfileImageSelector
            currentImage={userData.profile_image || profileImage}
            fallbackText={formatInitials(userData.name)}
            size="md"
            showEditButton={true}
            onImageChange={handleImageChange}
          />
        </div>
      </div>
      {/* profile details */}
      <div className="flex flex-col items-center gap-1">
        <div className="mt-8 flex items-center gap-2">
          <h1 className="text-3xl font-bold">{userData.name}</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            ({genderPronoun})
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div
              className={cn(
                userData.is_active ? "bg-green-500" : "bg-red-500",
                "size-2.5 rounded-full",
              )}
            />
            <p className="text-muted-foreground text-sm">
              {userData.is_active ? "Active" : "Inactive"}
            </p>
          </div>

          <p className="text-muted-foreground flex items-center gap-1 text-sm">
            <Briefcase className="size-4" /> {userData.department} -{" "}
            {userData.position}
          </p>

          <p className="text-muted-foreground flex items-center gap-1 text-sm">
            <Calendar1 className="size-4" /> Hired{" "}
            {formatMonthYear(userData.created_at)}
          </p>
        </div>
      </div>
    </>
  );
};
