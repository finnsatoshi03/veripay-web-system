import { useEffect, useMemo, useRef } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { getProfile } from "@/services/employee/profile-service";

export interface UserProfile {
  id?: number;
  first_name: string | null;
  last_name: string | null;
  contact_number: string | null;
  address: string | null;
  birth_date: string | null;
  gender: string | null;
  profile_image: string | null;
}

export interface Department {
  id?: number;
  name: string;
  description: string | null;
}

export interface Position {
  id?: number;
  title: string;
  level: number;
  base_salary: number;
}

export interface Employee {
  id?: number;
  employee_code: string | null;
  status: string;
  date_hired: string | null;
  department: Department | null;
  position: Position | null;
  created_at: string | null;
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
  fetchUserData: (
    userId: string,
    metadataRole?: string,
    force?: boolean,
  ) => Promise<void>;
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
    (set, get) => ({
      ...initialState,

      setUser: (userData) => set((state) => ({ ...state, ...userData })),

      clearUser: () => set(initialState),

      fetchUserData: async (userId, metadataRole, force) => {
        const currentState = get();
        // Preserve current role if no new role is provided
        const roleToUse = metadataRole || currentState.role || "";

        if (
          currentState.isLoading ||
          (!force &&
            currentState.id === Number(userId) &&
            currentState.profile &&
            currentState.role === roleToUse)
        ) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const userData = await getProfile(userId.toString());

          // Map the response to match our state structure
          let profile: UserProfile | null = null;
          if (userData.user_profiles) {
            // Handle both array and direct object formats
            const profileData = Array.isArray(userData.user_profiles)
              ? userData.user_profiles[0]
              : userData.user_profiles;

            if (profileData) {
              profile = {
                first_name: profileData.first_name,
                last_name: profileData.last_name,
                contact_number: profileData.contact_number,
                address: profileData.address,
                birth_date: profileData.birth_date,
                gender: profileData.gender,
                profile_image: profileData.profile_image,
              };
            }
          }

          // Map employee data if it exists
          let employee: Employee | null = null;
          if (userData.employees) {
            // Handle both array and direct object formats
            const employeeData = Array.isArray(userData.employees)
              ? userData.employees[0]
              : userData.employees;

            if (employeeData) {
              const departmentData = Array.isArray(employeeData.departments)
                ? employeeData.departments[0]
                : employeeData.departments;

              const positionData = Array.isArray(employeeData.positions)
                ? employeeData.positions[0]
                : employeeData.positions;

              employee = {
                id: employeeData.id,
                employee_code: employeeData.employee_code,
                status: employeeData.status,
                date_hired: employeeData.date_hired,
                department: departmentData
                  ? {
                      name: departmentData.name,
                      description: null,
                    }
                  : null,
                position: positionData
                  ? {
                      title: positionData.title,
                      level: positionData.level,
                      base_salary: positionData.base_salary,
                    }
                  : null,
                created_at: employeeData.created_at,
              };
            }
          }

          set({
            id: userData.id,
            email: userData.email,
            is_active: userData.is_active,
            identity_id: userData.identity_id,
            role: roleToUse, // Use the determined role
            profile,
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

  const didFetchRef = useRef(false);

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

  useEffect(() => {
    if (!id || profile || isLoading || didFetchRef.current) {
      return;
    }

    didFetchRef.current = true;
    const isFetching = useUserStore.getState().isLoading;
    if (!isFetching) {
      const currentRole = useUserStore.getState().role;
      useUserStore.getState().fetchUserData(id.toString(), currentRole);
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
