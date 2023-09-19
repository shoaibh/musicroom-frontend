"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import React, { FC } from "react";
import Link from "next/link";

interface Props {
  id?: number;
  owner?: string;
  name?: string;
  roomPic?: string;
  memberCount?: number;
  currentSong?: string;
}

export const Room: FC<Props> = ({
  id = 1,
  owner = "Shoaib",
  name = "AR Rahman's collection",
  roomPic = "/music-room.png",
  memberCount = 25,
  currentSong = "ye jo des",
}) => {
  return (
    <Link href={`/rooms/${id}`}>
      <Card className="w-11/12 mx-auto mt-5">
        <CardHeader className="flex-row items-center justify-between pt-[10px] pb-0">
          <CardTitle className="opacity-50">{owner}</CardTitle>
          <Image src={roomPic} width={40} height={40} alt="room pic" />
        </CardHeader>
        <CardContent className="text-lg">{name}</CardContent>
        <CardFooter className="justify-between">
          <div className="flex gap-1">
            <Image
              src={"/memberCount.svg"}
              width={20}
              height={20}
              alt="member count"
            />
            <span>{memberCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Image
              src={"/currentSong.svg"}
              width={20}
              height={20}
              alt="current song"
            />
            <span className="opacity-70">{currentSong}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
