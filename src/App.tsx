import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import AppRouter from "@/routes/AppRouter";
import { ErrorBoundary } from "@/features/error";
import { AuthProvider } from "@/features/auth/context/AuthContext";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/custom/theme-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 0,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ErrorBoundary>
        <ThemeProvider>
          <TooltipProvider delayDuration={100}>
            <BrowserRouter>
              <AuthProvider>
                <AppRouter />
                <Toaster />
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
