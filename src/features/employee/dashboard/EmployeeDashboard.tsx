import { AnnouncementOverview } from "./components/announcement-overview";
import { AttendanceOverview } from "./components/attendance-overview";

export default function EmployeeDashboard() {
  return (
    <div className="grid h-full min-h-0 flex-1 grid-cols-[1fr_0.4fr] gap-6 overflow-y-auto">
      <div className="space-y-6">
        <AttendanceOverview />
        <AnnouncementOverview />
      </div>
    </div>
  );
}
