'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Room } from './room';
import axios from '@/app/libs/axios-config';
import { useSocket } from '@/Context/SocketProvider';
import { IRoom } from '@/app/Constant';
import { MyRooms } from './my-rooms';
import { RecommendedRooms } from './recommended-rooms';

export const AllRooms = ({ jwt, userId }: { jwt: string; userId: Number }) => {
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ['all_rooms', jwt],
        queryFn: () => axios.get('/room/'),
        enabled: !!jwt
    });

    const { socket, isConnected } = useSocket();

    useEffect(() => {
        if (!isConnected) return;
        if (!socket) return;
        // eslint-disable-next-line
        socket.on('refresh', (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['all_rooms', jwt] });
        });

        return () => {
            socket.off('refresh');
        };
    }, [isConnected, socket, jwt, queryClient]);

    return (
        <div className="md:flex md:justify--around mt-7">
            <MyRooms rooms={data?.data?.data || []} />

            <div className="border-l border-slate-200 border-dashed h-[80vh] mt-[5px] hidden md:block" />

            <RecommendedRooms rooms={data?.data?.data || []} />
        </div>
    );
};
