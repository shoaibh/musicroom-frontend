"use client";

import { options } from "@/app/api/auth/[...nextauth]/options";
import Player from "@/components/player";
import { SearchBar } from "@/components/searchBar";
import { SongDetails } from "@/components/songDetails";
import { Session, getServerSession } from "next-auth";
import React, { useEffect, useState } from "react";
import SearchComponent from "./search-component";

export default function AudioRoom({
  session,
  id,
  res,
  videoId,
}: {
  session: Session | null;
  id: string;
  res: any;
  videoId: string;
}) {
  console.log("==", { res });
  const [info, setInfo] = useState<{ [key: string]: any }>();

  useEffect(() => {
    const asyncHelper = async () => {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/song/${videoId}`)
        .then((res) => res.json())
        .then((result) => {
          setInfo(result.data);
        });
    };

    asyncHelper();
  }, [videoId]);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const chooseSong = async (song: any) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/room/update/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          jwtToken: `${session?.backendTokens?.jwt}`,
        },
        body: JSON.stringify({
          videoId: song.videoId,
          roomId: id,
        }),
      }
    );
    const roomInfo = await response.json();
    console.log("==", { roomInfo });
    if (roomInfo.success) {
      setInfo(song);
      setSearchResults([]);
    }
  };

  return (
    <>
      <div className="flex justify-center w-full pt-5 flex-col">
        <SearchComponent
          chooseSong={chooseSong}
          search={search}
          setSearch={setSearch}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
        />
      </div>
      {info && (
        <div className="w-full">
          <Player videoId={info?.videoId} />
          <SongDetails info={info} />
        </div>
      )}
    </>
  );
}
