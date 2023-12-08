'use client';

import Image from 'next/image';
import { FC } from 'react';

export const QueueUser: FC<{ name: string; email: string; image: string | null }> = ({
    name,
    email,
    image
}) => {
    return (
        <div className="border relative border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground my-3  mx-10 lg:mx-5 p-2 rounded-lg cursor-pointer flex justify-start text-start items-center gap-[10px]">
            <div className="relative rounded-full">
                <Image
                    src={image || '/user_default.svg'}
                    width={50}
                    height={50}
                    alt="song"
                    className="rounded-full min-h-[50px] max-h-[50px] min-w-[50px] max-w-[50px]"
                />
            </div>
            <div className="max-w-[350px] ">
                <div
                    className="text-lg"
                    style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        WebkitLineClamp: 2
                    }}>
                    {name}
                </div>
                <div className="opacity-40">{email}</div>
            </div>
        </div>
    );
};
