import React from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchAndViewControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  startItem: number;
  endItem: number;
  totalItems: number;
  placeholder?: string;
}

const SearchAndViewControls: React.FC<SearchAndViewControlsProps> = ({
  searchQuery,
  setSearchQuery,
  startItem,
  endItem,
  totalItems,
  placeholder = "Search",
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-4 space-y-3 sm:space-y-0">
      <div className="relative w-full sm:w-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full sm:w-64 md:w-80 pl-6 pr-4 text-sm placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
        <Search className="absolute right-5 top-5 transform -translate-y-1/2 h-3 w-4 text-gray-400" />
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start sm:space-x-4">
        <span className="text-xs md:text-sm text-gray-500">
          Showing {totalItems > 0 ? startItem : 0}-{endItem} of {totalItems}
        </span>
        <div className="relative">
          <button className="px-2 md:px-3 py-1 border border-gray-300 rounded-md text-xs md:text-sm text-gray-700 flex items-center">
            <Filter className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndViewControls;