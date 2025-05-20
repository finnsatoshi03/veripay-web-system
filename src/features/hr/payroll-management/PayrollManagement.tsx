import { Eye, Paperclip } from "lucide-react";
import PayrollHeader from "./components/PayrollHeader";
import GenericTable, { type Column } from "@/components/table/generic-table";


// Define your payroll interface
interface PayrollPeriod {
  id: number;
  period: string;
  status: 'Processed' | 'Processing' | 'Scheduled';
  numberOfEmployees: number | null;
  totalGross: string | null;
  totalDeductions: string | null;
  totalNet: string | null;
}

export default function PayrollManagement() {
  // Sample payroll data based on your image
  const payrollData: PayrollPeriod[] = [
    {
      id: 1,
      period: "April 16 - April 30, 2025",
      status: "Processed",
      numberOfEmployees: 139,
      totalGross: "₱1,482,000.00",
      totalDeductions: "₱276,500.00",
      totalNet: "₱1,205,500.00"
    },
    {
      id: 2,
      period: "May 1 - May 15, 2025",
      status: "Processed",
      numberOfEmployees: 138,
      totalGross: "₱1,460,000.00",
      totalDeductions: "₱271,200.00",
      totalNet: "₱1,188,800.00"
    },
    {
      id: 3,
      period: "May 16 - May 31, 2025",
      status: "Processing",
      numberOfEmployees: 138,
      totalGross: "₱1,490,000.00",
      totalDeductions: "₱282,900.00",
      totalNet: "₱1,207,100.00"
    },
    {
      id: 4,
      period: "June 1 - June 15, 2025",
      status: "Scheduled",
      numberOfEmployees: null,
      totalGross: null,
      totalDeductions: null,
      totalNet: null
    },
    {
      id: 5,
      period: "June 16 - June 30, 2025",
      status: "Scheduled",
      numberOfEmployees: null,
      totalGross: null,
      totalDeductions: null,
      totalNet: null
    },
    {
      id: 6,
      period: "July 1 - July 15, 2025",
      status: "Scheduled",
      numberOfEmployees: null,
      totalGross: null,
      totalDeductions: null,
      totalNet: null
    },
    {
      id: 7,
      period: "July 16 - July 30, 2025",
      status: "Scheduled",
      numberOfEmployees: null,
      totalGross: null,
      totalDeductions: null,
      totalNet: null
    },
    {
      id: 8,
      period: "August 1 - August 15, 2025",
      status: "Scheduled",
      numberOfEmployees: null,
      totalGross: null,
      totalDeductions: null,
      totalNet: null
    },
    {
      id: 9,
      period: "August 16 - August 30, 2025",
      status: "Scheduled",
      numberOfEmployees: null,
      totalGross: null,
      totalDeductions: null,
      totalNet: null
    }
  ];

  // Define columns for GenericTable
  const columns: Column<PayrollPeriod>[] = [
    {
      key: 'period',
      header: 'Period',
      width: '25%',
      renderCell: (item: PayrollPeriod) => (
        <div>
          <span>{item.period}</span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: '13%',
      renderCell: (item: PayrollPeriod) => {
        const statusConfig: Record<string, { color: string; textColor: string; bgColor: string }> = {
          'Processed': { color: 'bg-green-500', textColor: 'text-green-800', bgColor: 'bg-green-100' },
          'Processing': { color: 'bg-blue-500', textColor: 'text-blue-800', bgColor: 'bg-blue-100' },
          'Scheduled': { color: 'bg-yellow-500', textColor: 'text-yellow-800', bgColor: 'bg-yellow-100' }
        };
        
        const config = statusConfig[item.status] || { color: 'bg-gray-500', textColor: 'text-gray-800', bgColor: 'bg-gray-100' };

        return (
          <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full ${config.color} mr-1`} />
            <span className={`px-2 py-1 rounded-full text-xs ${config.bgColor} ${config.textColor}`}>
              {item.status}
            </span>
          </div>
        );
      }
    },
    {
      key: 'numberOfEmployees',
      header: '# of Employees',
      width: '12%',
      renderCell: (item: PayrollPeriod) => (
        <div>
          <span>{item.numberOfEmployees || "--"}</span>
        </div>
      )
    },
    {
      key: 'totalGross',
      header: 'Total Gross',
      width: '14%',
      renderCell: (item: PayrollPeriod) => (
        <div>
          <span>{item.totalGross || "--"}</span>
        </div>
      )
    },
    {
      key: 'totalDeductions',
      header: 'Total Deductions',
      width: '14%',
      renderCell: (item: PayrollPeriod) => (
        <div>
          <span>{item.totalDeductions || "--"}</span>
        </div>
      )
    },
    {
      key: 'totalNet',
      header: 'Total Net',
      width: '14%',
      renderCell: (item: PayrollPeriod) => (
        <div>
          <span>{item.totalNet || "--"}</span>
        </div>
      )
    }
  ];

  // Custom actions for payroll rows
  const renderActions = (_item: PayrollPeriod) => (
    <div className="flex justify-end space-x-4">
      <button className="text-gray-500 hover:text-gray-700">
        <Paperclip size={16} />
      </button>
      <button className="text-gray-500 hover:text-gray-700">
        <Eye size={16} />
      </button>
    </div>
  );

  return (
    <div className="">
      <PayrollHeader />
      
      {/* Using our reusable table component */}
      <GenericTable
        data={payrollData}
        columns={columns}
        searchPlaceholder="Search payroll details..."
        showActions={true}
        renderActions={renderActions}
        initialRowsPerPage={10}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </div>
  );
}