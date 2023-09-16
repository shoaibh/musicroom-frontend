"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

const LogoutButton = () => {
  const onLogOut = () => {
    signOut();
  };
  return (
    <Button variant={"outline"} onClick={onLogOut}>
      Logout
    </Button>
  );
};

export default LogoutButton;
