import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { signInWithPassword } from "@/services/auth-service";

type LoginFormData = {
  email: string;
  password: string;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginFormData) =>
      signInWithPassword(data.email, data.password),
    onSuccess: () => {
      toast.success("Successfully logged in!");
    },
    onError: (error: Error) => {
      toast.error(`Login failed: ${error.message || "Invalid credentials"}`);
    },
  });
};
