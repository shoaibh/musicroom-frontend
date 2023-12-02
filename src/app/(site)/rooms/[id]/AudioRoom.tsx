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
    user
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
}) {
    const { data: video } = useQuery({
        queryKey: ['room_video_id', jwt, id],
        queryFn: () => axios.get(`/room/${id}`),
        enabled: !!jwt && !!id
    });

    const { data } = useQuery({
        queryKey: ['song_info', video?.data?.data?.videoId],
        queryFn: () => axios.get(`/song/${video?.data?.data?.videoId}`),
        enabled: !!video?.data?.data?.videoId
    });

    return (
        <>
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
                <div className="flex items-center pl-0 -ml-[10px] pt-[20px] pb-[20px] gap-[10px] justify-center">
                    <FaCircleInfo />
                    {isOwner
                        ? 'Search a song to start listening'
                        : 'Tell to room owner to play a song'}
                </div>
            )}
        </>
    );
}
