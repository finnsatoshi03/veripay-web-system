import { supabase } from "../supabase";

export const getProfile = async (id: string) => {
  console.log("id", id);

  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
          id, email, is_active, created_at, identity_id,
          employees (
            employee_code, status, date_hired,
            departments (
              name
            ),
            positions (
              title, level, base_salary
            )
          ),
          user_profiles (
            first_name, last_name, contact_number, address, birth_date, gender
          )
        `,
      )
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};
