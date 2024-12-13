import { forwardRef } from "react";

const SearchBox = forwardRef(({ handleSearch }, ref) => {
  return (
    <div>
      <input
        type="text"
        name="search"
        className="border border-gray-400 rounded px-4 py-2 text-zinc-500 outline-none focus:border-red-500 w-[400px] my-2"
        placeholder="Search..."
        ref={ref}
        onKeyUp={handleSearch}
      />
    </div>
  );
});

SearchBox.displayName = "SearchBox";

export default SearchBox;
