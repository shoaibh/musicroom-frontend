import React, { FC } from 'react';
import Image from 'next/image';
interface Props {
    // eslint-disable-next-line
    songInfo: any;
    // eslint-disable-next-line
    chooseSong: any;
}


const SearchResultComponent: FC<Props> = ({ songInfo, chooseSong }) => {
    return (
        <div
            className="flex hover:bg-accent hover:text-accent-foreground justify-between py-4 px-0 items-center cursor-pointer"
            onMouseDown={() => {
                chooseSong(songInfo);
            }}>
            <Image
                src={songInfo.thumbnail}
                alt={songInfo.title}
                width={54}
                height={54}
                className="rounded-full h-[54px] w-[54px] ml-4"
            />
            <div className="max-w-[220px]">
                <div
                    style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        WebkitLineClamp: 1
                    }}>
                    {songInfo.title}
                </div>
                <div className="opacity-40">{songInfo.author?.name}</div>
            </div>
            <div className="opacity-40 mr-4">{songInfo.timestamp}</div>
        </div>
    );
};

export default SearchResultComponent;
