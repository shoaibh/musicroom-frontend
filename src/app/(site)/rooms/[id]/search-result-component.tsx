import React, { FC } from "react";

interface Props {
  songInfo: any;
  chooseSong: any;
}

const SearchResultComponent: FC<Props> = ({ songInfo, chooseSong }) => {
  return (
    <div
      className="flex justify-between mb-4 py-4 px-0 items-center hover:bg-slate-200 cursor-pointer"
      onClick={() => {
        chooseSong(songInfo);
      }}
    >
      <img
        src={songInfo.thumbnail}
        alt={songInfo.title}
        style={{ height: "54px", width: "54px" }}
      />
      <div className="ml-[20px]">
        <div style={{ fontSize: "16px" }}>{songInfo.title}</div>
        <div>{songInfo.author?.name}</div>
      </div>
      <div style={{ color: "grey" }}>{songInfo.timestamp}</div>
    </div>
  );
};

export default SearchResultComponent;
