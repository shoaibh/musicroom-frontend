'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo } from 'react';
import { Room } from './room';
import axios from '@/app/libs/axios-config';
import { useSocket } from '@/Context/SocketProvider';
import { IRoom } from '@/app/Constant';
import { MyRooms } from './my-rooms';
import { RecommendedRooms } from './recommended-rooms';
import { useMainContext } from '@/Context/MainContext';

export const AllRooms = ({ jwt, userId }: { jwt: string; userId: string }) => {
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ['all_rooms', jwt],
        queryFn: () => axios.get('/room/'),
        enabled: !!jwt
    });

    const { socket, isConnected } = useSocket();

    const { isMobile } = useMainContext();

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

    const { ownedRooms, recommendedRooms } = useMemo(() => {
        if (data?.data?.data) {
            const ownedRooms = data.data.data.filter((d: IRoom) => d?.owner?._id === userId);
            const recommendedRooms = data.data.data.filter((d: IRoom) => d?.owner?._id !== userId);
            return {
                ownedRooms,
                recommendedRooms
            };
        }
        return {
            ownedRooms: [],
            recommendedRooms: []
        };
    }, [data?.data?.data, userId]);

    return (
        <div
            className="md:flex md:justify--around mt-7"
            style={{ height: `${isMobile ? 'auto' : 'calc(100vh - 96px)'}` }}>
            {ownedRooms && <MyRooms rooms={ownedRooms} userId={userId} />}

            <div className="border-l border-slate-200 border-dashed h-[80vh] mt-[5px] hidden md:block" />

            {recommendedRooms && <RecommendedRooms rooms={recommendedRooms} />}
        </div>
    );
};
