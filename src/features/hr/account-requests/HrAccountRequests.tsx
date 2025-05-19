import { useState } from "react";
import { Check, X } from "lucide-react";
import HeaderSection from "@/components/custom/common/HeaderSection";
import ReusableTable, { type Column } from "@/components/custom/common/ReusableTable";


// Define your data types
interface AccountRequest {
  id: number;
  name: string;
  email: string;
  status: string;
}

export default function HrAccountRequests() {
  // Sample data
  const accountRequestsData: AccountRequest[] = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Person ${i + 1}`,
    email: `person${i + 1}@example.com`,
    status: i % 3 === 0 ? "Approved" : i % 3 === 1 ? "Pending" : "Rejected",
  }));

  // Define columns with custom rendering when needed
  const columns: Column<AccountRequest>[] = [
    { 
      key: "name", 
      header: "Name", 
      width: "25%" 
    },
    { 
      key: "email", 
      header: "Email", 
      width: "35%" 
    },
    { 
      key: "status", 
      header: "Status", 
      width: "20%",
      // Custom rendering for status column
      renderCell: (item) => (
        <div className="flex items-center">
          <span
            className={`w-2 h-2 rounded-full mr-2 ${
              item.status === "Approved"
                ? "bg-green-500"
                : item.status === "Pending"
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
          ></span>
          {item.status}
        </div>
      )
    },
  ];

  // Custom action buttons
  const renderActions = (item: AccountRequest) => (
    <>
      <button className="hover:text-red-600 flex items-center justify-center">
        <X size={16} />
      </button>
      <button className="hover:text-green-600 flex items-center justify-center">
        <Check size={16} />
      </button>
    </>
  );

  return (
    <div className="p-4">
      <HeaderSection title="Account Requests" />
      
      <ReusableTable
        data={accountRequestsData}
        columns={columns}
        title="Account Requests"
        searchPlaceholder="Search account details"
        showActions={true}
        renderActions={renderActions}
        initialRowsPerPage={10}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </div>
  );
}