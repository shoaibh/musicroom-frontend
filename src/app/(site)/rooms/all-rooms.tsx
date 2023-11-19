"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Room } from "./room";
import axios from "@/app/libs/axios-config";
import { useSocket } from "@/Context/SocketProvider";
import { IRoom } from "@/app/Constant";

export const AllRooms = ({ jwt }: { jwt: string }) => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["all_rooms", jwt],
    queryFn: () => axios.get("/room/"),
    enabled: !!jwt,
  });

  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!isConnected) return;

    socket.on("refresh", (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["all_rooms", jwt] });
    });

    return () => {
      socket.off("refresh");
    };
  }, [isConnected, socket]);

  return (
    <>
      {data?.data?.data?.map((r: IRoom) => (
        <Room
          name={r.name}
          id={r.id}
          key={r.id}
          currentSong={r.currentSong || undefined}
          owner={r.owner}
        />
      ))}
    </>
  );
};
