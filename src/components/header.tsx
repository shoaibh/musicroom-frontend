import { User } from '@/app/(site)/header/user';
import { FC } from 'react';
import { Logo } from './logo';

export const Header: FC<{
    user: {
        id: string;
        name: string;
        email: string;
        image: string;
    };
}> = ({ user }) => {
    return (
        <div className="flex justify-between w-full items-center pl-[20px] pr-[20px] ">
            {/* <SearchBar /> */}
            <div />
            {/* <Notification /> */}
            <Logo />
            <User user={user} />
        </div>
    );
};
