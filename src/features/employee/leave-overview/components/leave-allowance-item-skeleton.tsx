import { Skeleton } from "@/components/ui/skeleton";

export const LeaveAllowanceItemSkeleton = () => {
  return (
    <div className="space-y-1">
      <div>
        <Skeleton className="h-4 w-24" />
        <div className="mt-1 flex items-end gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="mb-1 h-5 w-32" />
        </div>
      </div>

      <div className="flex w-full items-center gap-1">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-5 w-2/3 opacity-50" />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <Skeleton className="size-3.5" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <Skeleton className="size-3.5 opacity-50" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>

        <div className="flex justify-between">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
};
