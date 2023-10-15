import { options } from "@/app/api/auth/[...nextauth]/options";
import Player from "@/components/player";
import { SongDetails } from "@/components/songDetails";
import { getServerSession } from "next-auth";
import React from "react";
import SearchComponent from "./search-component";

export default async function PlayerRoom({
  params,
}: {
  params: { id: string };
}) {
  console.log("==", { params });
  const session = await getServerSession(options);
  const [info, setInfo] = useState({});
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
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

  const chooseSong = async (song) => {
    const roomInfo = await RoomApi.updateSong({
      videoId: song.videoId,
      roomId: id,
    });
    if (roomInfo.success) {
      setInfo(song);
      setSearchResults([]);
    }
  };

  return (
    <div className="h-[100vh] flex flex-col justify-between">
      <div className="flex justify-center w-full pt-5">
        <SearchComponent
          chooseSong={chooseSong}
          search={search}
          setSearch={setSearch}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
        />
      </div>
      {res?.data?.videoId && (
        <div className="w-full">
          <Player videoId={res?.data?.videoId} />
          <SongDetails videoId={res.data.videoId} />
        </div>
      )}
    </div>
  );
}
