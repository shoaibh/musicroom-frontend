import Image from 'next/image';
import { FC } from 'react';

interface Props {
    // eslint-disable-next-line
    info: any;
}

export const SongDetails: FC<Props> = ({ info }) => {
    return (
        <div className="flex justify-center mt-[10px] md:gap-[20px] gap-[10px]">
            <Image
                src={info?.thumbnails?.[0].url || '/default-song.png'}
                width={54}
                height={54}
                alt="song"
                className="rounded-full h-[54px] w-[54px]"
            />

            <div className="max-w-[350px]">
                <div
                    className="text-start"
                    style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        WebkitLineClamp: 2
                    }}>
                    {info?.title}
                </div>
                <div className="opacity-40">{info?.author?.name}</div>
            </div>
        </div>
    );
};
