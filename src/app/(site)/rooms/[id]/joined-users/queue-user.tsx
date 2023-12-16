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
            <div className="relative w-11 h-11 rounded-full overflow-hidden">
                <Image
                    src={image || '/user_default.svg'}
                    alt="user"
                    className="rounded-full"
                    objectFit="cover"
                    objectPosition="50% 50%"
                    layout="fill"
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
