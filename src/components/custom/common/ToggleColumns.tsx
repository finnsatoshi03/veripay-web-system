// import { useState, useRef, useEffect } from "react";
// import { Check, ChevronDown } from "lucide-react";

// // Define column configuration type
// interface ColumnConfig {
//   id: string;
//   label: string;
//   visible: boolean;
// }

// interface ToggleColumnsProps {
//   columns: ColumnConfig[];
//   onChange: (columns: ColumnConfig[]) => void;
// }

// export default function ToggleColumns({ columns, onChange }: ToggleColumnsProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Handle toggle of dropdown
//   const toggleDropdown = () => setIsOpen(!isOpen);

//   // Handle toggle of column visibility
//   const toggleColumn = (id: string) => {
//     const updatedColumns = columns.map(col => 
//       col.id === id ? { ...col, visible: !col.visible } : col
//     );
//     onChange(updatedColumns);
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         onClick={toggleDropdown}
//         className="flex items-center justify-between space-x-2 px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors text-sm"
//       >
//         <span>Toggle columns</span>
//         <ChevronDown className="h-4 w-4" />
//       </button>
      
//       {isOpen && (
//         <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
//           <div className="p-2">
//             <h3 className="text-xs font-semibold text-gray-700 pb-2 border-b border-gray-100">
//               Toggle columns
//             </h3>
//             <div className="mt-2 space-y-1">
//               {columns.map((column) => (
//                 <div 
//                   key={column.id}
//                   onClick={() => toggleColumn(column.id)}
//                   className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded cursor-pointer"
//                 >
//                   <div className="flex items-center justify-center w-5">
//                     {column.visible && <Check className="h-4 w-4 text-gray-700" />}
//                   </div>
//                   <span className="text-sm text-gray-700">{column.label}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }