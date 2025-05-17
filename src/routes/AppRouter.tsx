import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "@/layout/PublicLayout";
import ProtectedLayout from "@/layout/ProtectedLayout";

// Protected Routes
import EmployeePage from "@/features/employee/EmployeePage";
import HrPage from "@/features/hr/HrPage";

// Public Routes
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import ForgotPasswordPage from "@/features/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/ResetPasswordPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route index element={<Navigate to="/login" replace />} />

      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedLayout />}>
        <Route path="/hr" element={<HrPage />} />
        <Route path="/employee" element={<EmployeePage />} />
      </Route>
    </Routes>
  );
}
