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
