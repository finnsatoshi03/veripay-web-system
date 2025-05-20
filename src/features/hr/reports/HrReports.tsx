import { Search } from "@/components/custom/search";
import TableHeader from "@/components/table/table-header";
import ReportCard, { type Priority } from "./components/ReportCard";

export default function HrReports() {

  // Sample data for the cards
  const toAssignData = [
    {
      id: 1,
      category: "Attendance",
      title: "Incorrect Work Hours",
      description: "Logged 6 hours instead of 8. Please verify against shift schedule.",
      date: "04/20/2025",
      priority: "high" as Priority,
    },
    {
      id: 2,
      category: "Attendance",
      title: "Incorrect Work Hours",
      description: "Logged 6 hours instead of 8. Please verify against shift schedule.",
      date: "04/20/2025",
      priority: "normal" as Priority,
    },
    {
      id: 3,
      category: "Attendance",
      title: "Incorrect Work Hours",
      description: "Logged 10 hours instead of 8. Please verify against shift schedule.",
      date: "05/20/2025",
      priority: "low" as Priority,
    },
  ];

  const assignedData = [
    {
      id: 1,
      category: "Payroll",
      title: "Unreflected Overtime",
      description: "Filed OT not reflected in timesheet. Needs update.",
      assignee: "HR",
      date: "04/18/2025",
      priority: "normal" as Priority,
    },
        {
      id: 2,
      category: "Attendance",
      title: "Incorrect Work Hours",
      description: "Logged 10 hours instead of 8. Please verify against shift schedule.",
      date: "05/20/2025",
      assignee: "HR",
      priority: "high" as Priority,
    },
  ];

  return (
    <div className="">
      <div className="">
        <TableHeader title="Reports" />
        <Search className="mb-6" />

        {/* Tabs layout */}
        <div className="flex mb-6">
          {/* To Assign Tab */}
          <div className="flex-1">
            <h2 className="font-semibold text-xl flex items-center">
              To Assign
              <span className="ml-2 bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                {toAssignData.length}
              </span>
            </h2>

            {/* Card grid for "To Assign" section */}
            <div className="mt-4 space-y-4">
              {toAssignData.map((card) => (
                <ReportCard
                  key={card.id}
                  category={card.category}
                  title={card.title}
                  description={card.description}
                  date={card.date}
                  priority={card.priority}
                />
              ))}
            </div>
          </div>

          {/* Vertical separator */}
          <div className="mx-2"></div>

          {/* Assigned Tab */}
          <div className="flex-1">
            <h2 className="font-semibold text-xl flex items-center">
              Assigned
              <span className="ml-2 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                {assignedData.length}
              </span>
            </h2>

            {/* Card grid for "Assigned" section */}
            <div className="mt-4 space-y-4">
              {assignedData.map((card) => (
                <ReportCard
                  key={card.id}
                  category={card.category}
                  title={card.title}
                  description={card.description}
                  assignee={card.assignee}
                  date={card.date}
                  priority={card.priority}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}