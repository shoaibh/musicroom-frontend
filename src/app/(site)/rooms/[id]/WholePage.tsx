'use client';

import { useMainContext } from '@/Context/MainContext';
import { useSocket } from '@/Context/SocketProvider';
import { BackButton } from '@/components/backButton';
import { Logo } from '@/components/logo';
import { Session } from 'next-auth';
import { FC, useEffect, useState } from 'react';
import { IoIosArrowUp } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { User } from '../../header/user';
import { ChatComponent } from './chat/chat-component';
import { JoinedUsers } from './joined-users/joined-users';
import { JoinedUsersMobile } from './joined-users/joined-users-mobile';
import { SongQueue } from './song-queue/song-queue';
import axios from '@/app/libs/axios-config';
import { useQuery } from '@tanstack/react-query';
import { useGetRoom } from '@/components/hooks/useGetRoom';
import Image from 'next/image';
import { MusicBar } from '@/components/music/music-bar';
import { MobilePage } from './MobilePage';

export const WholePage: FC<{
    session: Session | null;
    isOwner: boolean;
    id: string;
}> = ({ session, isOwner, id }) => {
    const { socket, isConnected } = useSocket();

    useEffect(() => {
        if (!isConnected) return;

        if (!socket) return;

        socket.emit('join-room', { roomId: id, userId: session?.user?.id });

        return () => {
            socket.emit('leave-room', { roomId: id, userId: session?.user?.id });
            socket.off('join-room');
        };
    }, [socket, id, isConnected, session?.user?.id]);

    const [showMobileUsers, setShowMobileUsers] = useState(false);

    const { isMobile } = useMainContext();

    return (
        <div className="flex justify-around h-full bg-gray-100 gap-4 ">
            {!isMobile && (
                <div className="bg-white max-w-[320px] min-w-[200px] w-full mt-[76px] mb-[30px] text-center rounded-2xl hidden lg:block">
                    {session && (
                        <SongQueue
                            jwt={session.backendTokens.jwt}
                            id={id}
                            isOwner={isOwner}
                            user={session.user}
                        />
                    )}
                </div>
            )}
            {showMobileUsers && session && (
                <JoinedUsersMobile
                    setShowMobileUsers={setShowMobileUsers}
                    jwt={session.backendTokens.jwt}
                    id={id}
                    isOwner={isOwner}
                    user={session.user}
                />
            )}

            <div className="w-full h-[100vh] flex flex-col bg-white relative">
                <div className="px-7 pt-7 pb-2">
                    <div className="flex justify-between w-full items-center pl-[20px] pr-[20px] ">
                        {/* <SearchBar /> */}
                        {/* <Notification /> */}
                        <BackButton />
                        <Logo />
                        {session?.user && (
                            <User user={session.user} setShowMobileUsers={setShowMobileUsers} />
                        )}
                    </div>
                </div>
                {session?.user && id && <ChatComponent user={session.user} roomId={id} />}
                {isMobile && <MobilePage session={session} id={id} isOwner={isOwner} />}
            </div>
            {session && (
                <div className="bg-white max-w-[320px] min-w-[200px] w-full mt-[76px] mb-[30px] text-center rounded-2xl hidden lg:block">
                    <JoinedUsers
                        jwt={session.backendTokens.jwt}
                        id={id}
                        isOwner={isOwner}
                        user={session.user}
                    />
                </div>
            )}
        </div>
    );
};
