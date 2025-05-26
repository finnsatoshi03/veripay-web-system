import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPasswordWithToken } from "@/services/auth-service";

export const useResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return useMutation({
    mutationFn: (newPassword: string) => {
      const accessToken = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");

      if (!accessToken || !refreshToken) {
        throw new Error(
          "Invalid reset link. Please request a new password reset.",
        );
      }

      return resetPasswordWithToken(accessToken, refreshToken, newPassword);
    },
    onSuccess: () => {
      toast.success(
        "Password updated successfully! You can now log in with your new password.",
      );
      navigate("/login");
    },
    onError: (error: Error) => {
      const errorMessage = error?.message || "Failed to reset password";

      if (errorMessage.includes("Invalid reset link")) {
        toast.error(
          "Invalid or expired reset link. Please request a new password reset.",
        );
        navigate("/forgot-password");
      } else {
        toast.error("Failed to update password. Please try again.");
      }
    },
  });
};
