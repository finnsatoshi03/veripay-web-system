import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updatePasswordWithCurrentPassword } from "@/services/auth-service";

type ChangePasswordParams = {
  newPassword: string;
  currentPassword: string;
  userId: string;
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({
      newPassword,
      currentPassword,
      userId,
    }: ChangePasswordParams) =>
      updatePasswordWithCurrentPassword(newPassword, currentPassword, userId),
    onSuccess: () => {
      toast.success("Password updated successfully!");
    },
    onError: (error: Error) => {
      const errorMessage = error?.message || "Failed to update password";

      if (errorMessage.includes("Auth session missing")) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Failed to update password. Please try again.");
      }
    },
  });
};
