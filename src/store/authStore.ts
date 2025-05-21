import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabase } from "@/services/supabase";

type AuthUser = {
  id: string;
  email: string;
  role: string;
};

interface AuthState {
  // State
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: AuthUser | null) => void;
  setLoading: (isLoading: boolean) => void;

  // Auth operations
  checkSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      // Auth operations
      checkSession: async () => {
        try {
          set({ isLoading: true });
          const { data } = await supabase.auth.getSession();

          if (data.session) {
            const userData = data.session.user;
            const userRole = userData.user_metadata?.role || "USER";

            set({
              user: {
                id: userData.id,
                email: userData.email || "",
                role: userRole,
              },
              isAuthenticated: true,
            });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          console.error("Error checking session:", error);
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true });
          await supabase.auth.signOut();
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error("Error signing out:", error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// Setup auth listener
export const setupAuthListener = () => {
  const { setUser } = useAuthStore.getState();

  const { data: authListener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const userData = session.user;
        const userRole = userData.user_metadata?.role || "USER";

        setUser({
          id: userData.id,
          email: userData.email || "",
          role: userRole,
        });
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    },
  );

  return () => {
    authListener.subscription.unsubscribe();
  };
};
