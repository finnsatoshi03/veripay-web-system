import { today } from "@/features/employee/_lib/helpers";
import { AccountRequestsBoard } from "./components/account-requests-board";

export default function HrAccountRequests() {
  return (
    <div className="flex h-full flex-col gap-4 !overflow-hidden">
      <div className="space-y-2">
        <div>
          <h1 className="text-3xl font-bold">Account Requests</h1>
          <p className="text-muted-foreground text-sm">{today}</p>
        </div>
      </div>

      <div className="relative h-full min-h-0 flex-1 overflow-auto">
        <AccountRequestsBoard />
      </div>
    </div>
  );
}
