import { PayrollManagementBoard } from "./components/payroll-management-board";
import PayrollHeader from "./components/PayrollHeader";

export default function PayrollManagement() {
  return (
    <div className="flex h-full flex-col gap-4 !overflow-hidden">
      <PayrollHeader />

      <div className="relative h-full min-h-0 flex-1 overflow-auto">
        <PayrollManagementBoard />
      </div>
    </div>
  );
}