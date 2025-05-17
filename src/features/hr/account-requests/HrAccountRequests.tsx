import { X, Check, MoreHorizontal } from "lucide-react";
import HeaderSection from "@/components/custom/common/HeaderSection";
import DataTable from "@/components/custom/common/DataTable";

// Define the interface for the data items
interface AccountRequest {
  id: number;
  name: string;
  email: string;
  status: string;
}

export default function HrAccountRequests() {
  // Sample data with explicit typing
  const allData: AccountRequest[] = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Person ${i + 1}`,
    email: `person${i + 1}@example.com`,
    status: i % 3 === 0 ? "Approved" : i % 3 === 1 ? "Pending" : "Rejected",
  }));

  // Define columns for the table - using visibility flags for columns
  const columns = [
    {
      key: "name",
      header: "Name",
      render: (item: AccountRequest) => (
        <div>
          {item.name}
          {/* Show email on mobile only */}
          <div className="text-xs text-gray-500 md:hidden">{item.email}</div>
        </div>
      )
    },
    {
      key: "email",
      header: "Email",
      render: (item: AccountRequest) => item.email
    },
    {
      key: "status",
      header: "Status",
      render: (item: AccountRequest) => (
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${
            item.status === "Approved" ? "bg-green-500" :
            item.status === "Pending" ? "bg-yellow-500" : "bg-red-500"
          }`}></span>
          {item.status}
        </div>
      )
    }
  ];

  // Render actions for each row
  const renderActions = (item: AccountRequest, toggleRowActions: Function, activeRow: number | null) => (
    <>
      {/* Desktop Actions */}
      <div className="hidden md:flex justify-end space-x-4">
        <button className="hover:text-red-600 flex items-center justify-center">
          <X size={16} />
        </button>
        <button className="hover:text-green-600 flex items-center justify-center">
          <Check size={16} />
        </button>
      </div>

      {/* Mobile Actions */}
      <div className="md:hidden flex justify-end">
        <button
          onClick={() => toggleRowActions(item.id)}
          className="text-gray-500"
        >
          <MoreHorizontal size={16} />
        </button>

        {/* Mobile Dropdown */}
        {activeRow === item.id && (
          <div className="absolute right-2 top-8 bg-white shadow-lg rounded-md border border-gray-200 z-10">
            <div className="py-1">
              <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center">
                <X size={14} className="mr-2 text-red-500" />
                Reject
              </button>
              <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center">
                <Check size={14} className="mr-2 text-green-500" />
                Approve
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="p-2 md:p-4">
      <HeaderSection title="Account Requests" />
      
      <DataTable
        data={allData}
        columns={columns}
        searchPlaceholder="Search account details"
        renderActions={renderActions}
        idKey="id"
      />
    </div>
  );
}