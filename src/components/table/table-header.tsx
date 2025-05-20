import React from 'react';

interface TableHeadeProps {
  title: string; // Prop to make the title dynamic
}

  const today = new Date();
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' } as const;
  const formattedDate = today.toLocaleDateString('en-US', options);

const TableHeader: React.FC<TableHeadeProps> = ({ title}) => {
  return (
    <div className="mb-5">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
      <div className="flex items-center">
        <div className="text-xs md:text-sm text-gray-500">Today {formattedDate}</div>
      </div>
    </div>
  );
};

export default TableHeader;