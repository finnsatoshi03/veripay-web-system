import AttendanceOverview from "./components/attendance-overview";

export default function EmployeeDashboard() {
  return (
    <div className="grid grid-cols-[1fr_0.4fr] gap-6">
      <div>
        <AttendanceOverview />
      </div>
    </div>
  );
}
