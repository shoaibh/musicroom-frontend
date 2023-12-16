import React, { FC, useState } from 'react';
import { IoIosArrowUp } from 'react-icons/io';
import Image from 'next/image';
import { useGetRoom } from '@/components/hooks/useGetRoom';
import { IoClose } from 'react-icons/io5';
import { MusicBar } from '@/components/music/music-bar';
import { Session } from 'next-auth';
import { SongQueue } from './song-queue/song-queue';

export const MobilePage: FC<{
    session: Session | null;
    id: string;
    isOwner: boolean;
}> = ({ session, id, isOwner }) => {
    const [showQueue, setShowQueue] = useState(false);

    const roomData = useGetRoom({ id, jwt: session?.backendTokens?.jwt });

    return (
        <>
            <div
                className="relative flex items-center lg:hidden cursor-pointer flex m-5 p-3 rounded-md bg-gray-200 gap-3"
                onClick={() => setShowQueue(true)}>
                <div className="min-width-[20px] min-height-[20px]">
                    <IoIosArrowUp size={25} color={'black'} />
                </div>
                <div className="relative rounded-full">
                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-black opacity-50 rounded-full"></div>
                    <Image
                        src={roomData?.currentSong?.image_url || '/default-song.png'}
                        width={50}
                        height={50}
                        alt="song"
                        className="rounded-full min-h-[50px] max-h-[50px] min-w-[50px] max-w-[50px]"
                    />
                </div>
                <div className="absolute left-[64px] bottom-[20px]">
                    <MusicBar />
                </div>
                <div
                    className="text-sm"
                    style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        WebkitLineClamp: 1
                    }}>
                    {roomData?.currentSong?.name}
                </div>
            </div>

            <div
                className={`block lg:hidden fixed bottom-0 left-0 w-full bg-white transition-transform duration-500  transform ${
                    showQueue ? 'translate-y-0' : 'translate-y-full'
                }`}
                style={{ height: 'calc(100vh - 76px)' }}>
                <div
                    className="absolute top-[10px] left-[40px] cursor-pointer z-10"
                    onClick={() => setShowQueue(false)}>
                    <IoClose size={40} />
                </div>
                {session && (
                    <SongQueue
                        jwt={session.backendTokens?.jwt}
                        id={id}
                        isOwner={isOwner}
                        user={session.user}
                    />
                )}
            </div>
        </>
    );
};
