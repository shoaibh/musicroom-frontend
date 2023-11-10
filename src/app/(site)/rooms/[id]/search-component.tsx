"use client";

import React, { FC, useCallback, useEffect, useState } from "react";
import { SearchBar } from "@/components/searchBar";
import SearchResultComponent from "./search-result-component";
import { Input } from "@/components/ui/input";
import { debounce } from "@/lib/utils";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/app/libs/axios-config";

interface Props {
  jwt: string;
  id: string;
}

const SearchComponent: FC<Props> = ({ jwt, id }) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const queryClient = useQueryClient();

  const { mutate: chooseSong } = useMutation({
    mutationFn: async (song: any) => {
      axios.put(`/room/update/${id}`, {
        videoId: song.videoId,
        currentSong: song?.title,
      });
    },
    onSuccess: () => {
      setSearchResults([]);
      queryClient.invalidateQueries({ queryKey: ["room_video_id", jwt, id] });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const debouncedF = useCallback(
    debounce((value) => {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/song/search?searchQuery=${value}`
      )
        .then((res) => res.json())
        .then((result) => {
          setSearchResults(result.data);
        });
    }, 300),
    []
  );
  return (
    <>
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
      {searchResults?.length > 0 && (
        <div className="z-10 m-[20px] mt-0 bg-white border border-slate-300 border-solid border-t-0 shadow-md">
          <div className="p-[10px]">
            {searchResults.map((result: any) => (
              <SearchResultComponent
                songInfo={result}
                chooseSong={chooseSong}
                key={result.videoId}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchComponent;
