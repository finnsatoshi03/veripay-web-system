import supabase from "@/lib/supabase";

interface Department {
  id: number;
  name: string;
  description: string;
}

interface Position {
  id: number;
  title: string;
  level: string;
  base_salary: number;
  department_id: number;
}

interface Employee {
  id: number;
  user_id: {
    id: number;
    user_profiles: {
      first_name: string;
      last_name: string;
      profile_image?: string;
    };
    user_roles: { role_id: { name: string } };
  };
  department_id: { id: number; name: string };
  position_id: {
    id: number;
    title: string;
    level: number;
    base_salary: number;
  };
  status: string;
  created_at: string;
}

export const getDepartments = async (): Promise<Department[] | undefined> => {
  try {
    const { data, error } = await supabase.from("departments").select("*");
    if (error) throw error;

    return data as Department[];
  } catch (error) {
    console.error(error);
  }
};

export const getPositions = async (): Promise<Position[] | undefined> => {
  try {
    const { data, error } = await supabase.from("positions").select("*");
    if (error) throw error;

    return data as Position[];
  } catch (error) {
    console.error(error);
  }
};

export const getEmployees = async (): Promise<Employee[] | undefined> => {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select(
        "*, user_id:users(id, user_profiles(first_name, last_name, profile_image), user_roles(role_id:roles(name))), department_id:departments(id, name), position_id:positions(id, title, level, base_salary)",
      );
    if (error) throw error;

    return data as Employee[];
  } catch (error) {
    console.error(error);
  }
};
