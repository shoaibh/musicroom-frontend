'use client';

import Player from '@/components/player';
import { SongDetails } from '@/components/songDetails';
import { useQuery } from '@tanstack/react-query';
import axios from '@/app/libs/axios-config';
import { FaCircleInfo } from 'react-icons/fa6';

export default function AudioRoom({
    id,
    jwt,
    isOwner,
    user,
    videoId
}: {
    id: string;
    jwt: string;
    isOwner: boolean;
    user: {
        id: Number;
        name: string;
        email: string;
        image: string;
    };
    videoId?: string;
}) {
    const { data } = useQuery({
        queryKey: ['song_info', videoId],
        queryFn: () => axios.get(`/song/${videoId}`),
        enabled: !!videoId
    });

    return (
        <div className="w-full text-sm">
            {data?.data?.data && (
                <div className="w-full pt-4 pb-[20px]">
                    {user && (
                        <Player
                            audioUrl={data.data.data?.audioUrl}
                            isOwner={isOwner}
                            roomId={id}
                            user={user}
                        />
                    )}
                    {<SongDetails info={data?.data?.data} />}
                </div>
            )}
            {!data?.data?.data && (
                <div className="flex items-center pl-0 pt-[20px] pb-[20px] gap-[10px] justify-center">
                    <FaCircleInfo />
                    {isOwner
                        ? 'Search a song to start listening'
                        : 'Tell to room owner to play a song'}
                </div>
            )}
        </div>
    );
}
