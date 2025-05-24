import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
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
    onError: (error: Error) => {
      // Handle specific error cases
      const errorMessage = error?.message || "Unknown error occurred";

      if (errorMessage.includes("already registered")) {
        toast.error(
          "This email is already registered. Please try signing in instead.",
        );
      } else if (errorMessage.includes("pending registration request")) {
        toast.error(
          "You already have a pending registration request. Please wait for approval.",
        );
      } else if (errorMessage.includes("already exists")) {
        toast.error("A registration request for this email already exists.");
      } else if (errorMessage.includes("Invalid email format")) {
        toast.error("Please enter a valid email address.");
      } else {
        toast.error(`Registration failed: ${errorMessage}`);
      }
    },
  });
};
