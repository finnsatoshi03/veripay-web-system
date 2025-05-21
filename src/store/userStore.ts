import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabase } from "@/services/supabase";
import { getProfile } from "@/services/employee/ProfileService";
import { useEffect, useMemo } from "react";

export interface UserProfile {
  id: number;
  first_name: string | null;
  last_name: string | null;
  contact_number: string | null;
  address: string | null;
  birth_date: string | null;
  gender: string | null;
}

export interface Department {
  id: number;
  name: string;
  description: string | null;
}

export interface Position {
  id: number;
  title: string;
  level: number;
  base_salary: number;
}

export interface Employee {
  id: number;
  employee_code: string | null;
  status: string;
  date_hired: string | null;
  department: Department | null;
  position: Position | null;
}

export interface UserState {
  id: number | null;
  email: string | null;
  is_active: boolean;
  identity_id: string | null;
  role: string;
  profile: UserProfile | null;
  employee: Employee | null;
  isLoading: boolean;
  error: string | null;
}

export interface UserActions {
  setUser: (user: Partial<UserState>) => void;
  clearUser: () => void;
  fetchUserData: (userId: number, metadataRole?: string) => Promise<void>;
}

const initialState: UserState = {
  id: null,
  email: null,
  is_active: false,
  identity_id: null,
  role: "",
  profile: null,
  employee: null,
  isLoading: false,
  error: null,
};

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (userData) => set((state) => ({ ...state, ...userData })),

      clearUser: () => set(initialState),

      fetchUserData: async (userId, metadataRole = "") => {
        set({ isLoading: true, error: null });  
        
        try {
          // Fetch basic user data
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, email, is_active, identity_id")
            .eq("id", userId)
            .single();

          if (userError) throw userError;

          // Fetch user profile
          const { data: profileData, error: profileError } = await supabase
            .from("user_profiles")
            .select(
              "id, first_name, last_name, contact_number, address, birth_date, gender",
            )
            .eq("user_id", userId)
            .single();

          // It's okay if profile doesn't exist yet
          if (profileError && profileError.code !== "PGRST116")
            throw profileError;

          // Fetch employee data if exists
          const { data: employeeData, error: employeeError } = await supabase
            .from("employees")
            .select(
              `
              id, 
              employee_code, 
              status, 
              date_hired, 
              department_id, 
              position_id
            `,
            )
            .eq("user_id", userId)
            .single();

          // It's okay if employee record doesn't exist
          if (employeeError && employeeError.code !== "PGRST116")
            throw employeeError;

          // If employee exists, fetch department and position details
          let employee: Employee | null = null;
          if (employeeData) {
            let department: Department | null = null;
            let position: Position | null = null;

            // Fetch department if exists
            if (employeeData.department_id) {
              const { data: deptData, error: deptError } = await supabase
                .from("departments")
                .select("id, name, description")
                .eq("id", employeeData.department_id)
                .single();

              if (!deptError) {
                department = deptData;
              }
            }

            // Fetch position if exists
            if (employeeData.position_id) {
              const { data: posData, error: posError } = await supabase
                .from("positions")
                .select("id, title, level, base_salary")
                .eq("id", employeeData.position_id)
                .single();

              if (!posError) {
                position = posData;
              }
            }
            
            employee = {
              id: employeeData.id,
              employee_code: employeeData.employee_code,
              status: employeeData.status,
              date_hired: employeeData.date_hired,
              department,
              position,
            };
          }

          set({
            id: userData.id,
            email: userData.email,
            is_active: userData.is_active,
            identity_id: userData.identity_id,
            role: metadataRole,
            profile: profileData || null,
            employee,
            isLoading: false,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          set({ error: (error as Error).message, isLoading: false });
        }
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        id: state.id,
        email: state.email,
        is_active: state.is_active,
        identity_id: state.identity_id,
        role: state.role,
        profile: state.profile,
        employee: state.employee,
        // Excluding transient states
        isLoading: undefined,
        error: undefined,
      }),
    },
  ),
);

export const useUser = () => {
  const {
    id,
    email,
    is_active,
    identity_id,
    role,
    profile,
    employee,
    isLoading,
    error,
  } = useUserStore();

  // Computed properties
  const fullName = useMemo(() => {
    if (!profile) return "";
    return `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
  }, [profile]);

  const hasRole = useMemo(() => {
    return (roleName: string) => role === roleName;
  }, [role]);

  const isHR = useMemo(() => {
    return role === "HR";
  }, [role]);

  const isEmployee = useMemo(() => {
    return employee !== null;
  }, [employee]);

  // Fetch user data if needed
  useEffect(() => {
    // This is just for development purposes - in production
    // the user data should be already loaded by the auth service
    if (id && !profile && !isLoading) {
      useUserStore.getState().fetchUserData(id);
    }
  }, [id, profile, isLoading]);

  return {
    id,
    email,
    is_active,
    identity_id,
    role,
    profile,
    employee,
    isLoading,
    error,

    // Computed properties
    fullName,
    hasRole,
    isHR,
    isEmployee,
  };
};
