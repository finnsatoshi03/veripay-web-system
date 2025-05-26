import { supabase } from "../supabase";
import { emailService } from "@/services/email-service";

export const getAccountRequest = async () => {
  try {
    const { data, error } = await supabase
      .from("registration_requests")
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const processRegistrationRequest = async (
  requestId: number,
  newStatus: string,
) => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "update-registration-status",
      {
        body: { id: requestId, newStatus },
      },
    );

    if (error) {
      console.error("Error updating registration request:", error);
      throw error;
    }

    // Send approval/rejection email
    if (data && data.user) {
      await emailService.sendAccountApprovalEmail({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        status: newStatus === "approved" ? "approved" : "rejected",
        welcomeUrl:
          newStatus === "approved"
            ? `${window.location.origin}/login`
            : undefined,
        rejectionReason:
          newStatus === "rejected"
            ? "Please contact HR for more information."
            : undefined,
      });
    }

    return data;
  } catch (error) {
    console.error("Exception in processRegistrationRequest:", error);
    throw error;
  }
};
