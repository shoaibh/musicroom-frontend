"use client";

import React, { FC, useState } from "react";
import { Input } from "./ui/input";
import SocialButton from "./social-button";
import { BsSearch } from "react-icons/bs";

interface Props {
  iconShow?: boolean;
}

export const SearchBar: FC<Props> = ({ iconShow = true }) => {
  const [searchInput, setSearchInput] = useState("");
  const [showIcon, setShowIcon] = useState(iconShow);

  const handleSubmit = () => {};

  return (
    <div className="flex bg-white">
      <form onSubmit={handleSubmit}>
        {showIcon ? (
          <span
            onClick={() => {
              setShowIcon(false);
            }}
            className="cursor-pointer"
          >
            <BsSearch />
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
            // onBlur={() => setShowIcon(true)}
          />
        )}
      </form>
    </div>
  );
};
