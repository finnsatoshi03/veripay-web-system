import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/services/supabase";

type AuthUser = {
  id: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();

        if (data.session) {
          const userData = data.session.user;
          const userRole = userData.user_metadata?.role || "USER";

          setUser({
            id: userData.id,
            email: userData.email || "",
            role: userRole,
          });
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
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
        setIsLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
