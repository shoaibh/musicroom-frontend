'use client';

import Player from '@/components/player';
import { SongDetails } from '@/components/songDetails';
import { useQuery } from '@tanstack/react-query';
import axios from '@/app/libs/axios-config';

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
            {video?.data?.data && (
                <div className="w-full pt-4 pb-[20px]">
                    {user && data?.data?.data && (
                        <Player
                            audioUrl={data.data.data?.audioUrl}
                            isOwner={isOwner}
                            roomId={id}
                            user={user}
                        />
                    )}
                    {data?.data?.data && <SongDetails info={data?.data?.data} />}
                </div>
            )}
        </>
    );
}
