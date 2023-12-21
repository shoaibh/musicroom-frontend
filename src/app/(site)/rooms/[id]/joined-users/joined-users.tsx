'use client';

import { useSocket } from '@/Context/SocketProvider';
import { useGetRoomUsers } from '@/components/hooks/useGetRoom';
import { useQueryClient } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { QueueUser } from './queue-user';
import { IUser } from '@/app/Constant';

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

export const JoinedUsers: FC<Props> = ({ id, jwt, isOwner, user }) => {
    const roomUsers = useGetRoomUsers({ jwt, id }) || [];

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
        <>
            <h2 className="text-xl mt-[18px]">Joined Users</h2>

            {roomUsers?.map((user: IUser) => (
                <QueueUser
                    key={user?.user?._id}
                    image={user?.user?.image}
                    name={user?.user?.name}
                    email={user?.user?.email}
                />
            ))}
        </>
    );
};
