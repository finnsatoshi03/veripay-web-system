import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAccountRequest,
  processRegistrationRequest,
} from "@/services/hr/account-requests-service";
import type { AccountRequest, RequestStatus } from "../lib/data";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/helpers/formatters";
import { queryKeys } from "@/lib/configs/query-keys";

// Hook to fetch all account requests
export const useAccountRequests = () => {
  return useQuery({
    queryKey: [queryKeys.HR.accountRequests],
    queryFn: getAccountRequest,
    select: (data) => {
      // Transform the data if needed (e.g., format dates, etc.)
      return data?.map((item) => ({
        ...item,
        id: String(item.id), // Ensure ID is a string
        name: `${item.first_name} ${item.last_name}`,
        requestDate: formatDate(item.created_at),
      }));
    },
  });
};

// Hook for processing account request status changes
export const useProcessAccountRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      status,
    }: {
      requestId: string;
      status: RequestStatus;
    }) => {
      return processRegistrationRequest(Number(requestId), status);
    },
    // Optimistic update - update the UI immediately before the server responds
    onMutate: async ({ requestId, status }) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: [queryKeys.HR.accountRequests],
      });

      // Save the previous state
      const previousData = queryClient.getQueryData([
        queryKeys.HR.accountRequests,
      ]);

      // Optimistically update the cache
      queryClient.setQueryData<AccountRequest[]>(
        [queryKeys.HR.accountRequests],
        (old) => {
          if (!old) return [];
          return old.map((request) =>
            request.id === requestId ? { ...request, status } : request,
          );
        },
      );

      // Return the previous state so we can roll back if something goes wrong
      return { previousData };
    },
    // If the mutation fails, use the context we saved to roll back
    onError: (err, _variables, context) => {
      toast.error(`Failed to update account request status: ${err}`);
      if (context?.previousData) {
        queryClient.setQueryData(
          [queryKeys.HR.accountRequests],
          context.previousData,
        );
      }
    },
    // Always refetch after error or success
    onSettled: () => {
      toast.success("Account request status updated successfully");
      queryClient.invalidateQueries({
        queryKey: [queryKeys.HR.accountRequests],
      });
    },
  });
};
