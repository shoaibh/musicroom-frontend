"use client";

import React, { FC, useCallback, useEffect, useState } from "react";
import SearchResultComponent from "./search-result-component";
import { Input } from "@/components/ui/input";
import { debounce } from "@/lib/utils";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/app/libs/axios-config";
import { useSocket } from "@/Context/SocketProvider";
import { LiaSpinnerSolid } from "react-icons/lia";

interface Props {
  jwt: string;
  id: string;
  isOwner: boolean;
}

const SearchComponent: FC<Props> = ({ jwt, id, isOwner }) => {
  const [search, setSearch] = useState("");

  const queryClient = useQueryClient();

  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!isConnected) return;
    socket.on("receive-change-song", (song: any) => {
      queryClient.invalidateQueries({ queryKey: ["room_video_id", jwt, id] });
    });
    return () => {
      socket.off("receive-change-song");
    };
  }, [socket, jwt, id, queryClient, isConnected]);

  const { mutate: chooseSong } = useMutation({
    mutationFn: async (song: any) => {
      const response = await axios.put(`/room/update/${id}`, {
        videoId: song.videoId,
        currentSong: song?.title,
      });
      return response.data;
    },
    onSuccess: (song) => {
      socket.emit("change-song", { song: song?.data, roomId: id });
      setSearch("");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const [debouncedValue, setDebouncedValue] = useState("");

  const { data: debouncedResults, isLoading } = useQuery({
    queryKey: ["search", debouncedValue],
    queryFn: () =>
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/song/search`, {
        params: { searchQuery: debouncedValue },
      }),
    enabled: !!debouncedValue, // Only fetch when debouncedValue is truthy (not an empty string)
    refetchOnWindowFocus: false, // Prevent automatic refetching on window focus
  });

  const debouncedF = useCallback(
    debounce((value) => {
      if (value.length > 2) {
        setDebouncedValue(value);
      }
    }, 700),
    []
  );

  if (!isOwner) return null;
  return (
    <div className="flex justify-center w-full pt-5 flex-col pb-[15px] relative">
      <Input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          if (!!e.target.value) {
            debouncedF(e.target.value);
          }
        }}
        id="search"
        name="search"
        type="search"
        required
        placeholder="search song"
        className="bg-white box-border my-0 mx-[15px] w-[calc(100% - 30px)]"
      />
      {search?.length > 2 && (
        <div className="absolute top-[57px] w-[92%] z-10 m-[20px] mt-0 bg-white shadow-md">
          <div className="p-[10px]  m-auto text-center">
            {isLoading && (
              <LiaSpinnerSolid
                size={30}
                className="mr-2 h-4 w-4 animate-spin text-center"
              />
            )}
            {debouncedResults?.data?.data?.map((result: any) => (
              <SearchResultComponent
                songInfo={result}
                chooseSong={chooseSong}
                key={result.videoId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
