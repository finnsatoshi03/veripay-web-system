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
    (set, get) => ({
      ...initialState,

      setUser: (userData) => set((state) => ({ ...state, ...userData })),

      clearUser: () => set(initialState),

      fetchUserData: async (userId, metadataRole) => {
        const currentState = get();
        // Preserve current role if no new role is provided
        const roleToUse = metadataRole || currentState.role || "";

        if (
          currentState.isLoading ||
          (currentState.id === userId &&
            currentState.profile &&
            currentState.role === roleToUse)
        ) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          // Use the profile service to fetch all user data in a single call
          const userData = await getProfile(userId.toString());

          // Map the response to match our state structure
          const profile: UserProfile | null = userData.user_profiles?.[0]
            ? {
                first_name: userData.user_profiles[0].first_name,
                last_name: userData.user_profiles[0].last_name,
                contact_number: userData.user_profiles[0].contact_number,
                address: userData.user_profiles[0].address,
                birth_date: userData.user_profiles[0].birth_date,
                gender: userData.user_profiles[0].gender,
              }
            : null;

          // Map employee data if it exists
          let employee: Employee | null = null;
          if (userData.employees?.[0]) {
            const employeeData = userData.employees[0];
            const departmentData = employeeData.departments?.[0];
            const positionData = employeeData.positions?.[0];

            employee = {
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
            };
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
      useUserStore.getState().fetchUserData(id, currentRole);
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
