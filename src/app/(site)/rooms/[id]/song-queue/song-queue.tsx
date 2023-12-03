'use client';

import React, { FC } from 'react';
import AudioRoom from './AudioRoom';
import { AddSong } from '@/components/modals/add-song';
import { useQuery } from '@tanstack/react-query';
import axios from '@/app/libs/axios-config';
import Image from 'next/image';
import { QueueItem } from './queue-item';

interface Props {
    id: string;
    jwt?: string;
    isOwner: boolean;
    user: {
        id: Number;
        name: string;
        email: string;
        image: string;
    };
}

export const SongQueue: FC<Props> = ({ id, jwt, isOwner, user }) => {
    const { data: video } = useQuery({
        queryKey: ['room_video_id', jwt, id],
        queryFn: () => axios.get(`/room/${id}`),
        enabled: !!jwt && !!id
    });

    console.log('==songqueue', { isOwner });

    return (
        <div className="text-center w-full relative flex flex-col justify-center h-full">
            <h2 className="text-xl mt-[18px]">Song Queue</h2>
            {jwt && <AddSong jwt={jwt} id={id} isOwner={isOwner} />}
            <div className="overflow-scroll flex-1  h-full">
                {video?.data?.data?.songQueue?.map(
                    (song: {
                        name: string;
                        videoId: string;
                        image_url: string;
                        isPlaying: boolean;
                    }) => <QueueItem song={song} />
                )}
            </div>

            {jwt && (
                <AudioRoom
                    jwt={jwt}
                    id={id}
                    isOwner={isOwner}
                    user={user}
                    videoId={video?.data?.data?.videoId}
                />
            )}
        </div>
    );
};
