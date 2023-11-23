import React, { FC } from "react";
import { SearchBar } from "./searchBar";
import { Logo } from "./logo";
import { User } from "@/app/(site)/header/user";

export const Header: FC<{
  user: {
    id: Number;
    name: string;
    email: string;
    image: string;
  };
}> = ({ user }) => {
  return (
    <div className="flex justify-between w-full items-center pl-[20px] pr-[20px] ">
      {/* <SearchBar /> */}
      <div />
      {/* <Notification /> */}
      <Logo />
      <User user={user} />
    </div>
  );
};
