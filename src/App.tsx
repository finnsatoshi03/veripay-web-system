import { BrowserRouter } from "react-router-dom";

import AppRouter from "@/routes/AppRouter";
import { ErrorBoundary } from "@/features/error";
import { ThemeProvider } from "@/components/custom/theme-provider";

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
