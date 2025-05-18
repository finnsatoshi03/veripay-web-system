import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Search } from "@/components/custom/search";

import { KanbanBoard } from "./components/kanban-board";
import { ReviewerDisplay } from "./components/reviewer-display";
import { CreateReportForm } from "./components/create-report-form";

import { today } from "../_lib/helpers";

export default function EmployeeReports() {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const hrReviewers = [
    {
      name: "John Doe",
      image: "https://github.com/shadcn.png",
    },
    {
      name: "Jane Doe",
      image: "https://github.com/shadcn.png",
    },
    {
      name: "Peter Parker",
      image: "https://github.com/shadcn.png",
    },
    {
      name: "Mary Jane",
      image: "https://github.com/shadcn.png",
    },
    {
      name: "John Smith",
      image: "https://github.com/shadcn.png",
    },
    {
      name: "Jane Smith",
      image: "https://github.com/shadcn.png",
    },
  ];

  return (
    <div className="flex h-full flex-col gap-4 !overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Reports History</h1>
            <p className="text-muted-foreground text-sm">{today}</p>
          </div>
          <Separator />
        </div>
        <ReviewerDisplay reviewers={hrReviewers} />
      </div>

      <div className="flex items-center justify-between">
        <Search size="sm" />
        <Button size="sm" onClick={() => setIsCreateFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Create new report
        </Button>
      </div>

      <div className="flex h-full min-h-0 flex-1 flex-col">
        <KanbanBoard />
      </div>

      {/* Create Report Form Dialog */}
      <CreateReportForm
        open={isCreateFormOpen}
        onOpenChange={setIsCreateFormOpen}
      />
    </div>
  );
}
