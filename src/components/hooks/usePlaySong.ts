import { useSocket } from '@/Context/SocketProvider';
import axios from '@/app/libs/axios-config';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const usePlaySong = ({ id }: { id?: string }) => {
    const { socket } = useSocket();

    const { mutateAsync: playSong, isPending } = useMutation({
        // eslint-disable-next-line
        mutationFn: async (song: {
            name: string;
            video_id: string;
            image_url: string;
            isPlaying: boolean;
        }) => {
            const response = await axios.put(`/room/update_song/${id}`, {
                videoId: song?.video_id,
                currentSong: song
            });
            return response.data;
        },
        onSuccess: (song) => {
            socket?.emit('change-song', { song: song?.data, roomId: id });
        },
        onError: (e: { response: { data: { message: string } } }) => {
            toast.error(e.response?.data.message);
        }
    });

    return { playSong, isPending };
};
