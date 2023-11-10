"use client";

import { FC, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { Input } from "./ui/input";

interface Props {
  iconShow?: boolean;
}

export const SearchBar: FC<Props> = ({ iconShow = true }) => {
  const [searchInput, setSearchInput] = useState("");
  const [showIcon, setShowIcon] = useState(iconShow);

  const handleSubmit = () => {};

  return (
    <div className="flex" onBlur={() => setShowIcon(true)}>
      <form onSubmit={handleSubmit}>
        {showIcon ? (
          <span
            onClick={() => {
              setShowIcon(false);
            }}
            className="cursor-pointer block w-[25px] h-[25px]"
          >
            <BsSearch className="w-full h-full" />
          </span>
        ) : (
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            id="search"
            name="search"
            type="search"
            required
            placeholder="search song"
            className="bg-white"
            onBlur={() => setShowIcon(true)}
          />
        )}
      </form>
    </div>
  );
};
