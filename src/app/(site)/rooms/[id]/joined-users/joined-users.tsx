'use client';

import { useGetRoom, useGetRoomUsers } from '@/components/hooks/useGetRoom';
import React, { FC, useEffect, useMemo } from 'react';
import { QueueUser } from './queue-user';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '@/Context/SocketProvider';
import toast from 'react-hot-toast';

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

export const JoinedUsers: FC<Props> = ({ id, jwt, isOwner, user }) => {
    const roomUsers = useGetRoomUsers({ jwt, id });

    const queryClient = useQueryClient();

    const { socket, isConnected } = useSocket();

    useEffect(() => {
        if (!isConnected) return;
        if (!socket) return;
        // eslint-disable-next-line
        socket.on('user-joined', (userId) => {
            queryClient.invalidateQueries({ queryKey: ['room_users', jwt, id] });
        });

        socket.on('user-left', (userId) => {
            queryClient.invalidateQueries({ queryKey: ['room_users', jwt, id] });
        });
        return () => {
            socket.off('user-joined');
            socket.off('user-left');
        };
    }, [socket, jwt, id, queryClient, isConnected]);

    return (
        <div className="bg-white max-w-[320px] min-w-[200px] w-full mt-[76px] mb-[30px] text-center rounded-2xl hidden lg:block">
            <h2 className="text-xl mt-[18px]">Joined Users</h2>

            {roomUsers?.map((user: any) => (
                <QueueUser key={user?.id} image={user?.image} name={user.name} email={user.email} />
            ))}
        </div>
    );
};
