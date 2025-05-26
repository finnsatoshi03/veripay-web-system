import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPassword } from "@/services/auth-service";

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (newPassword: string) => resetPassword(newPassword),
    onSuccess: () => {
      toast.success(
        "Password updated successfully! You can now log in with your new password.",
      );
      navigate("/login");
    },
    onError: (error: Error) => {
      const errorMessage = error?.message || "Failed to reset password";

      if (errorMessage.includes("Auth session missing")) {
        toast.error(
          "Session expired. Please request a new password reset link.",
        );
        navigate("/forgot-password");
      } else {
        toast.error("Failed to update password. Please try again.");
      }
    },
  });
};
