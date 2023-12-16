'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { Dispatch, FC, SetStateAction } from 'react';

interface Props {
    user: { id: string; name: string; email: string; image: string };
    setShowMobileUsers?: Dispatch<SetStateAction<boolean>>;
}

export const User: FC<Props> = ({ user, setShowMobileUsers }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                        src={user.image || '/user_default.svg'}
                        alt="user"
                        className="rounded-full"
                        objectFit="cover"
                        objectPosition="50% 50%"
                        layout="fill"
                    />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => setShowMobileUsers && setShowMobileUsers(true)}
                    className="block lg:hidden">
                    Joined Users
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
