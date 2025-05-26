import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "@/services/supabase";

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(
        "Password updated successfully! You can now log in with your new password.",
      );
      navigate("/login");
    },
    onError: (error: Error) => {
      const errorMessage = error?.message || "Failed to reset password";
      toast.error(errorMessage);
    },
  });
};
