import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sendPasswordResetEmail } from "@/services/auth-service";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => sendPasswordResetEmail(email),
    onSuccess: () => {
      toast.success(
        "Password reset email sent! Please check your inbox and follow the instructions.",
      );
    },
    onError: (error: Error) => {
      const errorMessage =
        error?.message || "Failed to send password reset email";

      if (errorMessage.includes("User not found")) {
        toast.error("No account found with this email address.");
      } else if (errorMessage.includes("Email not confirmed")) {
        toast.error("Please verify your email address first.");
      } else {
        toast.error("Failed to send password reset email. Please try again.");
      }
    },
  });
};
