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
            socket.off('join-room');
        };
    }, [socket, id, isConnected, session?.user?.id]);

    console.log('==', { isOwner });

    const [showMobileUsers, setShowMobileUsers] = useState(false);
    const [showQueue, setShowQueue] = useState(false);

    const { isMobile } = useMainContext();

    const roomData = useGetRoom({ id, jwt: session?.backendTokens?.jwt });

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
            {showMobileUsers && <JoinedUsersMobile setShowMobileUsers={setShowMobileUsers} />}

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
                {isMobile && (
                    <>
                        <div
                            className="block lg:hidden cursor-pointer flex m-5 p-3 rounded-md bg-gray-400 gap-3"
                            onClick={() => setShowQueue(true)}>
                            <IoIosArrowUp size={25} color={'white'} />
                            <span className="text-white">
                                {' '}
                                {roomData?.currentSong || 'current song'}
                            </span>
                        </div>

                        <div
                            className={`block lg:hidden fixed bottom-0 left-0 w-full bg-white transition-transform duration-500  transform ${
                                showQueue ? 'translate-y-0' : 'translate-y-full'
                            }`}
                            style={{ height: 'calc(100vh - 76px)' }}>
                            <div
                                className="absolute top-[10px] left-[40px] cursor-pointer z-10"
                                onClick={() => setShowQueue(false)}>
                                <IoClose size={40} />
                            </div>
                            {session && (
                                <SongQueue
                                    jwt={session.backendTokens?.jwt}
                                    id={id}
                                    isOwner={isOwner}
                                    user={session.user}
                                />
                            )}
                        </div>
                    </>
                )}

                {/* {session?.backendTokens?.jwt && (
                    <AudioRoom
                        jwt={session.backendTokens.jwt}
                        id={id}
                        isOwner={isOwner}
                        user={session?.user}
                    />
                )} */}
            </div>
            <JoinedUsers />
        </div>
    );
};
