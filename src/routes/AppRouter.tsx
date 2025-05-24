import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "@/layout/PublicLayout";
import ProtectedLayout from "@/layout/ProtectedLayout";
import { ProtectedRoute } from "@/components/custom/protected-route";
import { PublicRoute } from "@/components/custom/public-route";

// Protected Routes
// hr routes
import HrDashboard from "@/features/hr/dashboard/HrDashboard";
import HrAccountRequests from "@/features/hr/account-requests/HrAccountRequests";
import HrActiveEmployee from "@/features/hr/active-employee/HrActiveEmployee";
import HrAddEmployee from "@/features/hr/add-employee/HrAddEmployee";
import HrDeptAssignment from "@/features/hr/department-assignment/HrDeptAssignment";
import HrReports from "@/features/hr/reports/HrReports";
import HrLeaveManagement from "@/features/hr/leave-management/HrLeaveManagement";
import PayrollManagement from "@/features/hr/payroll-management/PayrollManagement";
import HrAnnouncements from "@/features/hr/announcements/HrAnnouncements";

// employee routes
import EmployeeDashboard from "@/features/employee/dashboard/EmployeeDashboard";
import EmployeeProfile from "@/features/employee/profile/EmployeeProfile";
import EmployeeAttendance from "@/features/employee/attendance/EmployeeAttendance";
import EmployeePayslips from "@/features/employee/payslips/EmployeePayslips";
import EmployeeReports from "@/features/employee/reports/EmployeeReports";
import EmployeeLeaveOverview from "@/features/employee/leave-overview/EmployeeLeaveOverview";
import EmployeeAnnouncements from "@/features/employee/announcements/EmployeeAnnouncements";

// Public Routes
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import ForgotPasswordPage from "@/features/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/ResetPasswordPage";

// error
import { NotFound } from "@/features/error";

export default function AppRouter() {
  return (
    <Routes>
      <Route index element={<Navigate to="/login" replace />} />

      <Route path="*" element={<NotFound />} />

      {/* Public routes - redirects if already authenticated */}
      <Route element={<PublicLayout />}>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedLayout />}>
        {/* HR Routes - protected by HR role */}
        <Route element={<ProtectedRoute allowedRoles={["HR"]} />}>
          <Route path="/hr/dashboard" element={<HrDashboard />} />
          <Route path="/hr/account-requests" element={<HrAccountRequests />} />
          <Route path="/hr/active-employee" element={<HrActiveEmployee />} />
          <Route path="/hr/add-employee" element={<HrAddEmployee />} />
          <Route
            path="/hr/department-assignment"
            element={<HrDeptAssignment />}
          />
          <Route path="/hr/reports" element={<HrReports />} />
          <Route path="/hr/leave-management" element={<HrLeaveManagement />} />
          <Route
            path="/hr/payroll-management"
            element={<PayrollManagement />}
          />
          <Route path="/hr/announcements" element={<HrAnnouncements />} />
        </Route>

        {/* Employee Routes - protected by EMPLOYEE role */}
        <Route element={<ProtectedRoute allowedRoles={["EMPLOYEE"]} />}>
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/profile" element={<EmployeeProfile />} />
          <Route path="/employee/attendance" element={<EmployeeAttendance />} />
          <Route path="/employee/payslips" element={<EmployeePayslips />} />
          <Route path="/employee/reports" element={<EmployeeReports />} />
          <Route
            path="/employee/leave-overview"
            element={<EmployeeLeaveOverview />}
          />
          <Route
            path="/employee/announcements"
            element={<EmployeeAnnouncements />}
          />
        </Route>
      </Route>
    </Routes>
  );
}
