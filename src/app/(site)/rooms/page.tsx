import React from "react";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Room } from "./room";
import { useQuery } from "@tanstack/react-query";
import { AllRooms } from "./all-rooms";

export const Rooms = async () => {
  // const token = await getToken()
  const session = await getServerSession(options);

  if (session?.backendTokens?.jwt) {
    return (
      <>
        <AllRooms jwt={session.backendTokens.jwt} />
        
      </>
    );
  }

  return <div>...loading</div>;
};
