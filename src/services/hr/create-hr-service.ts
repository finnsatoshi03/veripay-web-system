import { supabase } from "../supabase";

interface HrData {
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string;
  contact_number: string;
  address: string;
  gender: string;
  birthdate: string;
  department_id: number;
  //   department_id: {
  //     id: number;
  //     departments: {
  //       name: string;
  //     };
  //   };
  position_id: number;
  //     id: number;
  //     positions: {
  //       title: string;
  //       level: string;
  //       base_salary: number;
  //     };
  //   };
  date_hired: string;
}

// don't use yet (edge function on progress)
export const createHrService = async (values: HrData) => {
  try {
    const { data, error } = await supabase.from("employees").insert(values);
    if (error) throw error;

    return data;
  } catch (error) {
    console.error(error);
  }
};
