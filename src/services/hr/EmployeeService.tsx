import { supabase } from "../supabase";

export const getAccountRequest = async () => {
  try {
    const { data, error } = await supabase.from("users").select(
      `
          id, email, created_at,
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
    );

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.log(error);
    // toast (error)
  }
};

