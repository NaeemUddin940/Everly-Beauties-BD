"use client";
import React, { useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { RiCloseLine } from "react-icons/ri";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  return (
    <div className="w-full h-10 relative">
      <input
        type="text"
        placeholder="Search products here..."
        className="w-full text-black px-10 py-2 border border-gray-300 focus:outline-none rounded-full placeholder-black/90"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <RiCloseLine
          onClick={() => setSearch("")}
          className="text-xl absolute top-2.5 right-5 text-gray-500 hover:text-red-500 cursor-pointer duration-200"
        />
      )}
      <MdOutlineSearch className="absolute left-3 top-3 text-black size-5" />
    </div>
  );
};

export default SearchInput;