import { CheckCircle2, Clock, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RequestActions } from "./request-actions";

import type { AccountRequest } from "../lib/data";

interface AccountRequestsTableProps {
  requests: AccountRequest[];
  visibleColumns?: string[];
}

export const ACCOUNT_TABLE_COLUMNS = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "requestDate", label: "Request Date" },
  { id: "status", label: "Status" },
  { id: "actions", label: "Actions" },
];

export const AccountRequestsTable = ({
  requests,
  visibleColumns = ["name", "email", "requestDate", "status", "actions"],
}: AccountRequestsTableProps) => {
  // Filter columns by visibility
  const columns = ACCOUNT_TABLE_COLUMNS.filter((col) =>
    visibleColumns.includes(col.id),
  );

  const getColSpan = () => visibleColumns.length || 1;

  return (
    <Table>
      <TableHeader className="sticky top-0 bg-zinc-200">
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.id}
              className={column.id === "actions" ? "w-[100px]" : ""}
            >
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.length === 0 ? (
          <TableRow>
            <TableCell colSpan={getColSpan()} className="h-24 text-center">
              No account requests found.
            </TableCell>
          </TableRow>
        ) : (
          requests.map((request) => (
            <TableRow key={request.id} className="hover:bg-muted/50">
              {visibleColumns.includes("name") && (
                <TableCell className="font-medium">{request.name}</TableCell>
              )}
              {visibleColumns.includes("email") && (
                <TableCell className="text-muted-foreground">
                  {request.email}
                </TableCell>
              )}
              {visibleColumns.includes("requestDate") && (
                <TableCell className="text-muted-foreground text-sm">
                  {request.requestDate}
                </TableCell>
              )}
              {visibleColumns.includes("status") && (
                <TableCell>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium capitalize ${
                      request.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : request.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {request.status === "approved" ? (
                      <CheckCircle2 className="size-3" />
                    ) : request.status === "rejected" ? (
                      <XCircle className="size-3" />
                    ) : (
                      <Clock className="size-3" />
                    )}
                    {request.status}
                  </span>
                </TableCell>
              )}
              {visibleColumns.includes("actions") && (
                <TableCell>
                  <RequestActions request={request} />
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
