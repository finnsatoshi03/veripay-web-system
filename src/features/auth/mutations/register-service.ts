import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createRegistrationRequest } from "@/services/auth-service";

type RegisterFormData = {
  first_name: string;
  last_name: string;
  email: string;
};

export const useCreateRegistrationRequest = () => {
  return useMutation({
    mutationFn: (data: RegisterFormData) =>
      createRegistrationRequest({
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
      }),
    onSuccess: () => {
      toast.success(
        "Registration request submitted successfully! We'll review your request and get back to you soon.",
      );
    },
    onError: () => {
      toast.error(`Registration failed: Unknown error occurred`);
    },
  });
};
