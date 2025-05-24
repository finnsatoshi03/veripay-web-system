import { supabase } from "../supabase";

export const getHrEmployees = async () => {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select(
        "*, user_id(id, user_profiles(first_name, last_name, profile_image), user_roles(role_id))",
      )
      .eq("user_id.user_roles.role_id", 1);

    if (error) throw error;

    // Filter out employees with empty user_roles or without role_id = 1
    const filteredData =
      data?.filter(
        (employee) =>
          employee.user_id?.user_roles &&
          employee.user_id.user_roles.length > 0 &&
          employee.user_id.user_roles.some(
            (role: { role_id: number }) => role.role_id === 1,
          ),
      ) || [];

    return filteredData;
  } catch (error) {
    console.error("Error fetching HR employees:", error);
    return null;
  }
};
