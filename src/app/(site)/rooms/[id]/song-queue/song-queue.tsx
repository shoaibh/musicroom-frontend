'use client';

import React, { FC, useEffect } from 'react';
import AudioRoom from './AudioRoom';
import { AddSong } from '@/components/modals/add-song';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '@/app/libs/axios-config';
import Image from 'next/image';
import { QueueItem } from './queue-item';
import { useSocket } from '@/Context/SocketProvider';
import { useGetRoom } from '@/components/hooks/useGetRoom';

interface Props {
    id: string;
    jwt?: string;
    isOwner: boolean;
    user: {
        id: string;
        name: string;
        email: string;
        image: string;
    };
}

export const SongQueue: FC<Props> = ({ id, jwt, isOwner, user }) => {
    // const { data: video } = useQuery({
    //     queryKey: ['room_video_id', jwt, id],
    //     queryFn: () => axios.get(`/room/${id}`),
    //     enabled: !!jwt && !!id
    // });

    const video = useGetRoom({ jwt, id });

    const queryClient = useQueryClient();

    const { socket, isConnected } = useSocket();

    useEffect(() => {
        if (!isConnected) return;
        if (!socket) return;
        // eslint-disable-next-line
        socket.on('receive-change-song', (song: any) => {
            queryClient.invalidateQueries({ queryKey: ['room_video_id', jwt, id] });
        });
        return () => {
            socket.off('receive-change-song');
        };
    }, [socket, jwt, id, queryClient, isConnected]);

    return (
        <div className="text-center w-full relative flex flex-col justify-center h-full">
            <h2 className="text-xl mt-[18px]">Song Queue</h2>
            {jwt && <AddSong jwt={jwt} id={id} isOwner={isOwner} />}
            <div className="overflow-scroll flex-1  h-full">
                {video?.songQueue?.map(
                    (song: {
                        name: string;
                        video_id: string;
                        image_url: string;
                        isPlaying: boolean;
                    }) => <QueueItem song={song} id={id} key={song?.video_id} />
                )}
            </div>

            {jwt && (
                <AudioRoom
                    jwt={jwt}
                    id={id}
                    isOwner={isOwner}
                    user={user}
                    videoId={video?.videoId}
                />
            )}
        </div>
    );
};
