export interface Employee {
  id: number;
  role: {
    id: number;
    role?: {
      name: string;
    };
  };
  user_id: {
    id: number;
    user_profiles: {
      first_name: string;
      last_name: string;
      profile_image?: string;
    };
  };
  department_id: {
    id: number;
    departments: {
      name: string;
    };
  } | null;
  position_id: {
    id: number;
    positions: {
      title: string;
      level: number;
      base_salary: number;
    };
  } | null;
  status: string;
  created_at: string;
}

export interface Department {
  id: number;
  name: string;
  description: string;
}

export interface Position {
  id: number;
  title: string;
  level: string;
  base_salary: number;
  department_id: number;
}

export interface Report {
  id: number;
  category: string;
  status: "In Progress" | "To Review" | "Resolved" | "Rejected";
  title: string;
  description: string;
  assigned_to: {
    id: number;
    user_profiles: {
      first_name: string;
      last_name: string;
    };
  } | null;
  submitted_by: {
    id: number;
    user_profiles: {
      first_name: string;
      last_name: string;
    };
  };
  submitted_at: string;
  flag_level: "Low" | "Normal" | "High";
  created_at: string;
  rejection_reason?: string;
}
