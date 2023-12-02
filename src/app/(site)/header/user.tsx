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
    user: { id: Number; name: string; email: string; image: string };
    setShowMobileUsers: Dispatch<SetStateAction<boolean>>;
}

export const User: FC<Props> = ({ user, setShowMobileUsers }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Image src={user.image || '/user_default.svg'} width={40} height={40} alt="user" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => setShowMobileUsers(true)}
                    className="block lg:hidden">
                    Joined Users
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
