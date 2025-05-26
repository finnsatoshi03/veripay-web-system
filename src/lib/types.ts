export interface Sample_table {
  id: number /* primary key */;
  description?: string;
  created_at: string;
}

export interface Leave_type {
  leave_type_id: number /* primary key */;
  name: string;
  description?: string;
  max_days?: number;
}

export interface Benefit {
  benefit_id: number /* primary key */;
  name: string;
  type?: string;
  description?: string;
  is_taxable?: boolean;
  is_mandatory?: boolean;
  amount_type?: "fixed" | "percentage";
  default_value?: number;
}

export interface Position {
  position_id: number /* primary key */;
  title: string;
  level?: number;
  base_salary?: number;
}

export interface Role {
  role_id: number /* primary key */;
  name: string;
  description?: string;
}

export interface User_profile {
  user_profile_id: number /* primary key */;
  first_name: string;
  last_name?: string;
  contact_number?: string;
  address?: string;
  birth_date?: string;
  gender?: "male" | "female";
  profile_image_url?: string;
  identity_id: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface Department {
  department_id: number /* primary key */;
  name: string;
  description?: string;
}

export interface User_roles {
  id: number /* primary key */;
  user_id: string;
  role: string;
  created_at: string;
}

export interface User {
  user_id: number /* primary key */;
  email: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Payroll {
  payroll_id: number /* primary key */;
  period_start: string;
  period_end: string;
  is_processed?: boolean;
  date_processed?: string;
  status?: "draft" | "processing" | "completed" | "canceled";
  notes?: string;
  total_net_pay?: number;
  created_by?: number /* foreign key to user.user_id */;
  created_at?: string;
  user?: User;
}

export interface Announcement {
  announcement_id: number /* primary key */;
  title: string;
  body?: string;
  target_role?: number /* foreign key to role.role_id */;
  created_by?: number /* foreign key to user.user_id */;
  created_at?: string;
  scope?: "company" | "department" | "team";
  role?: Role;
  user?: User;
}

export interface Employee {
  employee_id: number /* primary key */;
  user_id?: number /* foreign key to user.user_id */;
  employee_number: string;
  department_id?: number /* foreign key to department.department_id */;
  position_id?: number /* foreign key to position.position_id */;
  date_hired?: string;
  status?: "active" | "inactive" | "on_leave" | "terminated";
  created_at?: string;
  updated_at?: string;
  user?: User;
  department?: Department;
  position?: Position;
}

export interface Employee_benefit {
  employee_benefit_id: number /* primary key */;
  employee_id: number /* foreign key to employee.employee_id */;
  benefit_id: number /* foreign key to benefit.benefit_id */;
  value?: number;
  effective_date?: string;
  end_date?: string;
  employee?: Employee;
  benefit?: Benefit;
}

export interface Payslip {
  payslip_id: number /* primary key */;
  employee_id: number /* foreign key to employee.employee_id */;
  payroll_id: number /* foreign key to payroll.payroll_id */;
  basic_pay: number;
  gross_pay: number;
  net_pay: number;
  allowances?: Record<string, number>;
  deductions?: Record<string, number>;
  net_salary: number;
  status?: "draft" | "issued" | "paid";
  remarks?: string;
  issued_at?: string;
  date_paid?: string;
  employee?: Employee;
  payroll?: Payroll;
}

export interface Attendance_record {
  attendance_record_id: number /* primary key */;
  employee_id: number /* foreign key to employee.employee_id */;
  date: string;
  time_in?: string;
  time_out?: string;
  status?: "present" | "on-leave";
  source?: string;
  employee?: Employee;
}

export interface Leave_request {
  leave_request_id: number /* primary key */;
  employee_id: number /* foreign key to employee.employee_id */;
  leave_type_id: number /* foreign key to leave_type.leave_type_id */;
  start_date: string;
  end_date: string;
  reason?: string;
  requested_at?: string;
  reviewed_by?: number /* foreign key to user.user_id */;
  reviewed_at?: string;
  status?: "pending" | "approved" | "rejected" | "canceled";
  employee?: Employee;
  leave_type?: Leave_type;
  user?: User;
}
