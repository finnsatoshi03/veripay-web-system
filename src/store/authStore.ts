import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabase, clearAllTokens } from "@/services/supabase";
import { checkSession } from "@/services/auth-service";
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

          // Use the improved session check from auth service
          const session = await checkSession();

          if (session?.user) {
            const userData = session.user;
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
          // Clear tokens on session check failure
          clearAllTokens();
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

          // Clear all tokens
          clearAllTokens();

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

// Setup auth listener with improved token handling
export const setupAuthListener = () => {
  const { setUser, setSigningOut } = useAuthStore.getState();

  const { data: authListener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log(
        "Auth store - Auth state change:",
        event,
        session?.user?.email,
      );

      // Check if user is on reset password page - don't auto-login during password reset
      const isOnResetPasswordPage =
        window.location.pathname === "/reset-password";

      if (event === "SIGNED_IN" && session && !isOnResetPasswordPage) {
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
        clearAllTokens(); // Ensure tokens are cleared
      } else if (event === "TOKEN_REFRESHED" && !isOnResetPasswordPage) {
        console.log("Auth store - Token refreshed successfully");
        // Token refresh is handled automatically by the supabase client
        // No need to update user state here as it remains the same
      }
    },
  );

  return () => {
    authListener.subscription.unsubscribe();
  };
};
