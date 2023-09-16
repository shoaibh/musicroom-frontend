import React from "react";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export const Rooms = async () => {
  // const token = await getToken()
  const session = await getServerSession(options);

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      jwtToken: `${session?.backendTokens?.jwt}`,
    },
  });

  const r = await response.json();

  const rooms = r.data;

  if (rooms?.length) {
    return (
      <>
        {rooms.map((r: Room) => (
          <div>{r.name}</div>
        ))}
      </>
    );
  }

  return <div>All Rooms</div>;
};
