import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";
import { signInWithPassword } from "@/services/auth-service";
import { useAuthStore } from "@/store/authStore";

type LoginFormData = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginFormData) =>
      signInWithPassword(data.email, data.password),
    onSuccess: (user) => {
      if (!user) return;

      // Manually update auth store with user data
      const userRole = user.user_metadata?.role;

      setUser({
        id: user.id,
        email: user.email || "",
        role: userRole || "USER",
      });

      toast.success("Successfully logged in!");

      // Navigate based on user role
      if (userRole === "HR") {
        navigate("/hr/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    },
    onError: (error: Error) => {
      toast.error(`Login failed: ${error.message || "Invalid credentials"}`);
    },
  });
};
