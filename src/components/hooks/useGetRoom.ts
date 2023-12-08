import { useQuery } from '@tanstack/react-query';
import axios from '@/app/libs/axios-config';

export const useGetRoom = ({ id, jwt }: { id?: string; jwt?: string }) => {
    const { data: video } = useQuery({
        queryKey: ['room_video_id', jwt, id],
        queryFn: () => axios.get(`/room/${id}`),
        enabled: !!jwt && !!id
    });

    return video?.data?.data;
};

export const useGetRoomUsers = ({ id, jwt }: { id?: string; jwt?: string }) => {
    const { data: video } = useQuery({
        queryKey: ['room_users', jwt, id],
        queryFn: () => axios.get(`/room/users/${id}`),
        enabled: !!jwt && !!id
    });

    return video?.data?.data;
};
