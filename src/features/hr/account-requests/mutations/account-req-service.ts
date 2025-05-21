import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAccountRequest,
  processRegistrationRequest,
} from "@/services/hr/account-requests-service";
import type { AccountRequest, RequestStatus } from "../lib/data";
import toast from "react-hot-toast";

// Query key constants
export const QUERY_KEYS = {
  ACCOUNT_REQUESTS: "account-requests",
};

// Hook to fetch all account requests
export const useAccountRequests = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCOUNT_REQUESTS],
    queryFn: getAccountRequest,
    select: (data) => {
      // Transform the data if needed (e.g., format dates, etc.)
      return data?.map((item) => ({
        ...item,
        id: String(item.id), // Ensure ID is a string
        name: `${item.first_name} ${item.last_name}`,
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
        queryKey: [QUERY_KEYS.ACCOUNT_REQUESTS],
      });

      // Save the previous state
      const previousData = queryClient.getQueryData([
        QUERY_KEYS.ACCOUNT_REQUESTS,
      ]);

      // Optimistically update the cache
      queryClient.setQueryData<AccountRequest[]>(
        [QUERY_KEYS.ACCOUNT_REQUESTS],
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
          [QUERY_KEYS.ACCOUNT_REQUESTS],
          context.previousData,
        );
      }
    },
    // Always refetch after error or success
    onSettled: () => {
      toast.success("Account request status updated successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACCOUNT_REQUESTS],
      });
    },
  });
};
