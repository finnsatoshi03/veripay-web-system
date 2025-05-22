import { supabase } from "../supabase";

export const getHrEmployees = async () => {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select("*, user_id(user_profiles(first_name, last_name))")
      .eq("role", "1");

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching HR employees:", error);
    return null;
  }
};
