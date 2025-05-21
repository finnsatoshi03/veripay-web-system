import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CompleteProfileForm } from "./complete-profile-form";
import type { UserProfile } from "@/store/userStore";

type ProfileCompletionDialogProps = {
  open: boolean;
  userId: number;
  profile: Partial<UserProfile> | null;
  onComplete: () => void;
};

export const ProfileCompletionDialog = ({
  open,
  userId,
  profile,
  onComplete,
}: ProfileCompletionDialogProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Complete Your Profile</AlertDialogTitle>
          <AlertDialogDescription>
            Please provide the missing information to complete your profile.
            This will help us personalize your experience.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <CompleteProfileForm
            profile={profile}
            userId={userId}
            onSuccess={onComplete}
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
