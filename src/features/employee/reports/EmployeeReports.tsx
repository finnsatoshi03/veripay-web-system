import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Search } from "@/components/custom/search";

import { ReportsBoard } from "./components/reports-board";
import { CreateReportForm } from "./components/create-report-form";
import { ReviewerDisplay } from "../_components/reviewer-display";

import { today } from "../_lib/helpers";
import { hrReviewers } from "../_lib/mock/mock-hrReviewers";

export default function EmployeeReports() {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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
        <ReviewerDisplay
          reviewers={hrReviewers}
          description="for incoming reports."
        />
      </div>

      <div className="flex items-center justify-between">
        <Search
          size="sm"
          placeholder="Search reports by title, description, category..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Button size="sm" onClick={() => setIsCreateFormOpen(true)}>
          <Plus className="size-4" />
          Create new report
        </Button>
      </div>

      <div className="flex h-full min-h-0 flex-1 flex-col">
        <ReportsBoard searchQuery={searchQuery} />
      </div>

      {/* Create Report Form Dialog */}
      <CreateReportForm
        open={isCreateFormOpen}
        onOpenChange={setIsCreateFormOpen}
      />
    </div>
  );
}
