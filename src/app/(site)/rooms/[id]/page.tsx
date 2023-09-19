import { options } from "@/app/api/auth/[...nextauth]/options";
import Player from "@/components/player";
import { SearchBar } from "@/components/searchBar";
import { getServerSession } from "next-auth";
import React from "react";

export default async function PlayerRoom({
  params,
}: {
  params: { id: string };
}) {
  console.log("==", { params });
  const session = await getServerSession(options);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${params.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        jwtToken: `${session?.backendTokens?.jwt}`,
      },
    }
  );

  const res = await response.json();

  console.log("==", { res });

  return (
    <div>
      <div className="flex justify-center w-full pt-5">
        <SearchBar iconShow={false} />
      </div>
      <Player videoId={res?.data?.videoId} />
    </div>
  );
}
