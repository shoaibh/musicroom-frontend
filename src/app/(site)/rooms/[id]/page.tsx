import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import AudioRoom from "./AudioRoom";
import SearchComponent from "./search-component";
import axios from "@/app/libs/axios-config";
import { ChatComponent } from "./chat-component";

export default async function PlayerRoom({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(options);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${params.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        jwtToken: `${session?.backendTokens?.jwt}`,
      },
    }
  );

  const response = await res.json();

  const isOwner = response?.data?.ownerId === session?.user?.id;

  return (
    <div className="h-[100vh] flex flex-col justify-between">
      <div className="flex justify-center w-full pt-5 flex-col">
        {session?.backendTokens?.jwt && isOwner && (
          <SearchComponent id={params.id} jwt={session.backendTokens.jwt} />
        )}
      </div>
      {session?.user && params.id && (
        <ChatComponent user={session.user} roomId={params.id} />
      )}
      {session?.backendTokens?.jwt && (
        <AudioRoom
          jwt={session.backendTokens.jwt}
          id={params.id}
          isOwner={isOwner}
        />
      )}
    </div>
  );
}
