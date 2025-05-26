import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { verifyEmail, verifyEmailWithTokens } from "@/services/auth-service";

export const useEmailVerification = () => {
  return useMutation({
    mutationFn: (
      tokenData: string | { accessToken: string; refreshToken: string },
    ) => {
      if (typeof tokenData === "string") {
        return verifyEmail(tokenData);
      } else {
        return verifyEmailWithTokens(
          tokenData.accessToken,
          tokenData.refreshToken,
        );
      }
    },
    onSuccess: () => {
      toast.success("Email verified successfully!");
    },
    onError: (error: Error) => {
      const errorMessage = error?.message || "Failed to verify email";

      if (errorMessage.includes("expired")) {
        toast.error("Verification link has expired. Please request a new one.");
      } else if (errorMessage.includes("invalid")) {
        toast.error("Invalid verification link. Please request a new one.");
      } else {
        toast.error("Failed to verify email. Please try again.");
      }
    },
  });
};
