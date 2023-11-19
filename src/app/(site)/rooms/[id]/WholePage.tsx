"use client";

import React, { FC, useEffect } from "react";
import SearchComponent from "./search-component";
import { ChatComponent } from "./chat-component";
import AudioRoom from "./AudioRoom";
import { Session } from "next-auth";
import { useSocket } from "@/Context/SocketProvider";

export const WholePage: FC<{
  session: Session | null;
  isOwner: boolean;
  id: string;
}> = ({ session, isOwner, id }) => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!isConnected) return;

    if (!socket) return;

    socket.emit("join-room", { roomId: id, userId: session?.user?.id });

    return () => {
      socket.off("join-room");
    };
  }, [socket, id, isConnected]);

  return (
    <>
      <div className="flex justify-center w-full pt-5 flex-col">
        {session?.backendTokens?.jwt && (
          <SearchComponent
            id={id}
            jwt={session.backendTokens.jwt}
            isOwner={isOwner}
          />
        )}
      </div>
      {session?.user && id && <ChatComponent user={session.user} roomId={id} />}
      {session?.backendTokens?.jwt && (
        <AudioRoom
          jwt={session.backendTokens.jwt}
          id={id}
          isOwner={isOwner}
          user={session?.user}
        />
      )}
    </>
  );
};
