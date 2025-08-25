import { LucideSearch } from "lucide-react";
import React from "react";

const SearchBar = () => {
  return (
    <div className="w-[400px] relative border border-grey-200 rounded-[8px] flex items-center">
      <LucideSearch className="absolute left-[12px] top-1/2 -translate-y-1/2 text-grey-600 size-[16px] shrink-0" />
      <input
        className="pl-[40px] pr-[12px] w-full h-[36px] outline-none bg-grey-25 border border-transparent focus:[box-shadow:0px_0px_6px_0px_var(--indigo-200)] rounded-[8px]"
        type="text"
        placeholder="Search anything..."
      />
    </div>
  );
};

export default SearchBar;
