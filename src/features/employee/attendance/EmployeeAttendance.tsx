import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

export default function EmployeeAttendance() {
  const today = new Date();
  const formattedDate = `Today ${format(today, "EEE, MMM dd, yyyy")}`;

  return (
    <div>
      <div className="flex justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Attendance History</h1>
            <p className="text-muted-foreground text-sm">{formattedDate}</p>
          </div>
          <Separator />
          <div className="flex items-center gap-2 rounded-md border px-2 py-1">
            <div className="flex items-center gap-1">
              <div className="bg-primary size-2.5 rounded-full"></div>
              <p className="text-sm font-medium">
                On time <span className="text-muted-foreground">80%</span>
              </p>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-secondary size-2.5 rounded-full"></div>
              <p className="text-sm font-medium">
                Late <span className="text-muted-foreground">20%</span>
              </p>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-input size-2.5 rounded-full"></div>
              <p className="text-sm font-medium">
                On leave <span className="text-muted-foreground">0%</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Total Attendance
            </p>
            <p className="text-2xl font-semibold">5 days</p>
          </div>

          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Total Hours
            </p>
            <p className="text-2xl font-semibold">40 hours</p>
          </div>

          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Ave. Check-in
            </p>
            <p className="text-2xl font-semibold">08:00 AM</p>
          </div>

          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Ave. Check-out
            </p>
            <p className="text-2xl font-semibold">05:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
