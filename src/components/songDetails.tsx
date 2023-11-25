import Image from 'next/image';
import { FC } from 'react';

interface Props {
    // eslint-disable-next-line
    info: any;
}

export const SongDetails: FC<Props> = ({ info }) => {
    return (
        <div className="flex pl-[25px] pt-[20px]">
            <Image
                src={info?.thumbnails?.[0].url || '/default-song.png'}
                width={54}
                height={54}
                alt="song"
                className="rounded-full h-[54px] w-[54px]"
            />

            <div className="max-w-[350px] ml-4">
                <div>{info?.title}</div>
                <div className="opacity-40">{info?.author?.name}</div>
            </div>
        </div>
    );
};
