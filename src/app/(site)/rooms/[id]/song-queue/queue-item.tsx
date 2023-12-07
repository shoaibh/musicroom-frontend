'use client';

import { usePlaySong } from '@/components/hooks/usePlaySong';
import { MusicBar } from '@/components/music/music-bar';
import Image from 'next/image';
import { FC } from 'react';

export const QueueItem: FC<{
    id: string;
    song: {
        name: string;
        video_id: string;
        image_url: string;
        isPlaying: boolean;
    };
}> = ({ id, song }) => {
    const playSong = usePlaySong({ id });

    return (
        <div
            className="border relative border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground my-3  mx-10 lg:mx-5 p-2 rounded-lg cursor-pointer flex justify-start text-start items-center gap-[10px]"
            onClick={() => playSong(song)}>
            <div className="relative rounded-full">
                {song?.isPlaying && (
                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-black opacity-50 rounded-full"></div>
                )}
                <Image
                    src={song?.image_url || '/default-song.png'}
                    width={50}
                    height={50}
                    alt="song"
                    className="rounded-full min-h-[50px] max-h-[50px] min-w-[50px] max-w-[50px]"
                />
            </div>
            {song?.isPlaying && (
                <div className="absolute left-[24px] bottom-[14px]">
                    <MusicBar />
                </div>
            )}
            <div
                className="max-w-[350px] text-sm"
                style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    WebkitLineClamp: 2
                }}>
                {song?.name}
            </div>
        </div>
    );
};
