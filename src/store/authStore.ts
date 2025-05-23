import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabase } from "@/services/supabase";
import toast from "react-hot-toast";

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
  isSigningOut: boolean;

  // Actions
  setUser: (user: AuthUser | null) => void;
  setLoading: (isLoading: boolean) => void;
  setSigningOut: (isSigningOut: boolean) => void;

  // Auth operations
  checkSession: () => Promise<void>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: true,
      isSigningOut: false,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      setSigningOut: (isSigningOut) => set({ isSigningOut }),

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
          set({ isSigningOut: true });

          const { error } = await supabase.auth.signOut();

          if (error) {
            toast.error(`Supabase sign out error: ${error.message}`);
            return { success: false, error: error.message };
          }

          set({
            user: null,
            isAuthenticated: false,
            isSigningOut: false,
          });

          return { success: true };
        } catch (error) {
          toast.error(`Unexpected error during sign out: ${error}`);
          set({ isSigningOut: false });
          return {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "An unexpected error occurred",
          };
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
  const { setUser, setSigningOut } = useAuthStore.getState();

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
        setSigningOut(false); // Ensure signing out state is cleared
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setSigningOut(false); // Ensure signing out state is cleared
      }
    },
  );

  return () => {
    authListener.subscription.unsubscribe();
  };
};
