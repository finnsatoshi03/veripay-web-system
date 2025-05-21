import { useState } from "react";
import { Calendar1, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { CreateLeaveRequestForm } from "../../leave-overview/components/create-leave-request-form";
import { leaveAllowance } from "../../_lib/mock/mock-leaveAllowance";

// types
interface ReportCardProps {
  status: string;
  title: string;
  tags: string[];
  date: string;
}

// components
export const ReportCard = ({ status, title, tags, date }: ReportCardProps) => {
  return (
    <div>
      <Badge variant="secondary">{status}</Badge>
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="text-muted-foreground flex items-center gap-1 text-sm">
          <Calendar1 className="size-4" />
          {date}
        </div>
      </div>
    </div>
  );
};

// main component
export const ReportsStatus = () => {
  // data
  const reportData: ReportCardProps = {
    status: "To review",
    title: "Employee Performance Report",
    tags: ["Payroll", "HR"],
    date: "July 16",
  };

  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);

  return (
    <div className="w-full space-y-2 rounded-lg border p-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Reports</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsRequestFormOpen(true)}
        >
          <Plus className="size-4" />
          New Report
        </Button>
      </div>
      <div className="bg-border -mx-2 h-px px-2" />

      <ReportCard {...reportData} />

      {/* form */}
      <CreateLeaveRequestForm
        open={isRequestFormOpen}
        onOpenChange={setIsRequestFormOpen}
        allowance={leaveAllowance}
      />
    </div>
  );
};
