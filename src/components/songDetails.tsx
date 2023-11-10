import Image from "next/image";
import { FC } from "react";

interface Props {
  info: any;
}

export const SongDetails: FC<Props> = ({ info }) => {
  return (
    <div className="flex p-[20px] ">
      <Image
        src={info?.image || "/default-song.png"}
        width={54}
        height={54}
        alt="song"
        className="rounded-full h-[54px] w-[54px]"
      />

      <div className="max-w-[350px] ml-4">
        <div>{info?.title}</div>
        <div className="opacity-40">{info?.author?.name}</div>
      </div>
    </div>
  );
};
