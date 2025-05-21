import { supabase } from "../supabase";


export const getAccountRequest = async (page = 1, pageSize = 10) => {
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("users")
      .select(
        `
          id, email, created_at, is_active,          
          user_profiles (
            first_name, last_name
          )
        `
      )
      .eq("is_active", false)
      .range(from, to);

    if (error) {
      throw new Error(error.message);
    }


    return data;
  } catch (error) {
    console.log(error);
    // toast(error.message);
    return null;
  }
};
