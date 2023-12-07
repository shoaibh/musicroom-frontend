'use client';

import React, { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from 'react';
import SearchResultComponent from './search-result-component';
import { Input } from '@/components/ui/input';
import { debounce } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '@/app/libs/axios-config';
import { useSocket } from '@/Context/SocketProvider';
import { LiaSpinnerSolid } from 'react-icons/lia';

interface Props {
    jwt: string;
    id: string;
    isOwner: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const SearchComponent: FC<Props> = ({ jwt, id, isOwner, setOpen }) => {
    const [search, setSearch] = useState('');

    const { socket } = useSocket();

    const { mutate: chooseSong } = useMutation({
        // eslint-disable-next-line
        mutationFn: async (song: any) => {
            console.log('==', { song });
            const response = await axios.put(`/room/update_queue/${id}`, {
                song: {
                    name: song.title,
                    video_id: song.videoId,
                    image_url: song?.image,
                    isPlaying: false
                }
            });
            return response.data;
        },
        onSuccess: (song) => {
            socket?.emit('change-song', { song: song?.data, roomId: id });
            setSearch('');
            setOpen(false);
        },
        onError: () => {
            toast.error('Something went wrong');
        }
    });

    const [debouncedValue, setDebouncedValue] = useState('');

    const { data: debouncedResults, isLoading } = useQuery({
        queryKey: ['search', debouncedValue],
        queryFn: () =>
            axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/song/search`, {
                params: { searchQuery: debouncedValue }
            }),
        enabled: !!debouncedValue, // Only fetch when debouncedValue is truthy (not an empty string)
        refetchOnWindowFocus: false // Prevent automatic refetching on window focus
    });

    const debouncedF = useCallback(
        // eslint-disable-next-line

        debounce((value) => {
            if (value.length > 2) {
                setDebouncedValue(value);
                setShowResults(true);
            }
        }, 700),
        // eslint-disable-next-line
        []
    );

    const [showResults, setShowResults] = useState(false);

    if (!isOwner) return null;
    return (
        <div className="flex justify-center w-full pt-5 flex-col pb-[15px] relative">
            <Input
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    if (e.target.value) {
                        debouncedF(e.target.value);
                    }
                }}
                id="search"
                name="search"
                type="search"
                required
                placeholder="search song"
                className="bg-white box-border my-0 mx-[15px] w-[calc(100% - 30px)]"
                onBlur={() => setShowResults(false)}
            />
            {showResults && search?.length > 2 && (
                <div className="absolute top-[57px] w-[92%] z-10 m-[20px] mt-0 bg-white shadow-md z-10">
                    <div className="p-[10px]  m-auto flex flex-col justify-center text-center">
                        {isLoading && (
                            <LiaSpinnerSolid
                                size={50}
                                className="h-7 w-7 animate-spin text-center text-black m-auto"
                            />
                        )}
                        {// eslint-disable-next-line
                        debouncedResults?.data?.data?.map((result: any) => (
                            <SearchResultComponent
                                songInfo={result}
                                chooseSong={chooseSong}
                                key={result.videoId}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchComponent;
