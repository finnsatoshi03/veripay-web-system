import { supabase } from "../supabase";

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
        body: { id: requestId, status: newStatus },
      },
    );

    if (error) {
      console.error("Error fetching registration request:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Exception in getRegistrationRequest:", error);
    throw error;
  }
};
