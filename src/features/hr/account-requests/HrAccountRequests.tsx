import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import GenericTable, { type Column } from "@/components/table/generic-table";
import TableHeader from "@/components/table/table-header";


// Define your data types
interface AccountRequest {
  id: number;
  name: string;
  email: string;
  status: string;
}

export default function HrAccountRequests() {
  // State to hold account requests data and loading status
  const [accountRequestsData, setAccountRequestsData] = useState<AccountRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching data from Supabase
  useEffect(() => {
    setIsLoading(true);
    // In a real app, replace this with your Supabase fetch logic, e.g.:
    // const fetchData = async () Ours {
    //   const { data, error } = await supabase.from("account_requests").select("*");
    //   if (!error) setAccountRequestsData(data || []);
    //   setIsLoading(false);
    // };
    // fetchData();

    // Simulate a delay and set an empty array to test "No data available"
    setTimeout(() => {
      setAccountRequestsData([]); // Empty array simulates no data from Supabase
      setIsLoading(false);
    }, 500); // 2-second delay to mimic loading
  }, []);

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
      width: "15%",
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
  const renderActions = (_item: AccountRequest) => (
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
    <div className="">
      <TableHeader title="Account Requests" />
      
      {isLoading ? (
        <div className="text-center py-6 text-gray-500">Loading data...</div>
      ) : (
        <GenericTable
          data={accountRequestsData}
          columns={columns}
          searchPlaceholder="Search account details"
          showActions={true}
          renderActions={renderActions}
          initialRowsPerPage={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      )}
    </div>
  );
}
