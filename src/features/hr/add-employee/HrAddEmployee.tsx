import { ScrollArea } from "@/components/ui/scroll-area";
import { AddEmployeeForm } from "./components/add-employee-form";

import { today } from "@/features/employee/_lib/helpers";

export default function HrAddEmployee() {
  return (
    <div className="flex h-full flex-col gap-4 !overflow-hidden">
      <div className="space-y-2">
        <div>
          <h1 className="text-3xl font-bold">Add New HR Employee</h1>
          <p className="text-muted-foreground text-sm">{today}</p>
        </div>
      </div>

      <ScrollArea className="relative h-full min-h-0 flex-1 overflow-auto">
        <AddEmployeeForm />
      </ScrollArea>
    </div>
  );
}
