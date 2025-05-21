export type RequestStatus = "pending" | "approved" | "rejected";

export interface AccountRequest {
  id: string;
  name: string;
  email: string;
  requestDate: string;
  status: RequestStatus;
}

export const mockAccountRequests: AccountRequest[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    requestDate: "2023-06-15",
    status: "pending",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    requestDate: "2023-06-14",
    status: "approved",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    requestDate: "2023-06-13",
    status: "rejected",
  },
  {
    id: "4",
    name: "Emily Williams",
    email: "emily.williams@example.com",
    requestDate: "2023-06-12",
    status: "pending",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    requestDate: "2023-06-11",
    status: "approved",
  },
  {
    id: "6",
    name: "Sarah Davis",
    email: "sarah.davis@example.com",
    requestDate: "2023-06-10",
    status: "pending",
  },
  {
    id: "7",
    name: "David Wilson",
    email: "david.wilson@example.com",
    requestDate: "2023-06-09",
    status: "rejected",
  },
  {
    id: "8",
    name: "Jennifer Taylor",
    email: "jennifer.taylor@example.com",
    requestDate: "2023-06-08",
    status: "pending",
  },
  {
    id: "9",
    name: "Thomas Anderson",
    email: "thomas.anderson@example.com",
    requestDate: "2023-06-07",
    status: "approved",
  },
  {
    id: "10",
    name: "Lisa Martinez",
    email: "lisa.martinez@example.com",
    requestDate: "2023-06-06",
    status: "rejected",
  },
];
