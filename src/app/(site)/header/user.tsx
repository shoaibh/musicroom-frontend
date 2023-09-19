"use client";

import { User as IUser } from "next-auth";
import Image from "next/image";
import React, { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "@/components/LogoutButton";
import { signOut } from "next-auth/react";

interface Props {
  user: { id: Number; name: string; email: string; image: string };
}

export const User: FC<Props> = ({ user }) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Image
            src={user.image || "user_default.svg"}
            width={40}
            height={40}
            alt="user"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
