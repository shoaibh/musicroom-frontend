"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Room } from "./room";
import axios from "@/app/libs/axios-config";

export const AllRooms = ({ jwt }: { jwt: string }) => {
  const { data } = useQuery({
    queryKey: ["all_rooms", jwt],
    queryFn: () => axios.get("/room/"),
    enabled: !!jwt,
  });

  return (
    <>
      <div>AllRooms</div>
      {data?.data?.data?.map((r: Room) => (
        <Room
          name={r.name}
          id={r.id}
          key={r.id}
          currentSong={r.currentSong || undefined}
        />
      ))}
    </>
  );
};
