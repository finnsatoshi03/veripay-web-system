import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";
import { signInWithPassword } from "@/services/auth-service";

type LoginFormData = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginFormData) =>
      signInWithPassword(data.email, data.password),
    onSuccess: (user) => {
      toast.success("Successfully logged in!");

      const userRole = user?.user_metadata?.role;

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
