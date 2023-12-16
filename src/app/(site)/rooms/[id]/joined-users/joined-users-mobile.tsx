'use client';

import React, { Dispatch, FC, SetStateAction, useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import { JoinedUsers } from './joined-users';

interface Props {
    id: string;
    jwt?: string;
    isOwner: boolean;
    user: {
        id: string;
        name: string;
        email: string;
        image: string;
    };
    setShowMobileUsers: Dispatch<SetStateAction<boolean>>;
}

export const JoinedUsersMobile: FC<Props> = ({ setShowMobileUsers, id, jwt, isOwner, user }) => {
    const divRef = useRef<HTMLDivElement>(null);

    console.log('==joine');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (divRef.current && !divRef.current.contains(event.target as Node)) {
                setShowMobileUsers(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div
            ref={divRef}
            className="bg-white max-w-[320px] w-full mt-[76px] mb-[30px] text-center rounded-2xl absolute block lg:hidden right-[30px] z-10 h-[80%] border border-slate-200  border-solid bg-popover"
            onBlur={() => {
                setShowMobileUsers(false);
            }}
            tabIndex={0}>
            <div
                className="absolute top-[10px] right-[10px] cursor-pointer"
                onClick={() => setShowMobileUsers(false)}>
                <IoClose size={20} />
            </div>
            <JoinedUsers jwt={jwt} id={id} isOwner={isOwner} user={user} />
        </div>
    );
};
