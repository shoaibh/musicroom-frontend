'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import React, { FC } from 'react';
import Link from 'next/link';
import { IRoom } from '@/app/Constant';

export const Room: FC<IRoom> = ({
    id = 1,
    owner,
    name = "AR Rahman's collection",
    roomPic = '/music-room.png',
    memberCount,
    currentSong = 'no song selected'
}) => {
    return (
        <Link href={`/rooms/${id}`}>
            <Card className="w-11/12 mx-auto mt-5 relative">
                <CardHeader className="flex-row items-center justify-between pt-[10px] pb-0">
                    <CardTitle className="opacity-50">{owner?.name || 'shoaib'}</CardTitle>
                    <Image src={roomPic} width={40} height={40} alt="room pic" />
                </CardHeader>
                <CardContent className="text-lg">{name}</CardContent>
                <CardFooter className="justify-between">
                    <div className="flex gap-1">
                        <Image src={'/memberCount.svg'} width={20} height={20} alt="member count" />
                        {memberCount && <span>{memberCount}</span>}
                    </div>
                    <div className="flex items-center gap-1">
                        <Image src={'/currentSong.svg'} width={20} height={20} alt="current song" />
                        <span className="opacity-70 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                            {currentSong}
                        </span>
                    </div>
                </CardFooter>
                {owner?.roomOwned && (
                    <div className="absolute text-white bg-black rounded-tl-[7px] rounded-tr-[2px] rounded-br-[2px] rounded-bl-[2px] text-xs px-[5px] py-0 top-[2px] left-[2px]">
                        owned
                    </div>
                )}
            </Card>
        </Link>
    );
};
