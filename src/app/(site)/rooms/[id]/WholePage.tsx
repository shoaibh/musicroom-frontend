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
            {/* {showMobileUsers && <JoinedUsersMobile setShowMobileUsers={setShowMobileUsers} />} */}

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
                            className="relative flex items-center lg:hidden cursor-pointer flex m-5 p-3 rounded-md bg-gray-200 gap-3"
                            onClick={() => setShowQueue(true)}>
                            <div className="min-width-[20px] min-height-[20px]">
                                <IoIosArrowUp size={25} color={'black'} />
                            </div>
                            <div className="relative rounded-full">
                                <div className="absolute top-0 right-0 bottom-0 left-0 bg-black opacity-50 rounded-full"></div>
                                <Image
                                    src={roomData?.currentSong?.image_url || '/default-song.png'}
                                    width={50}
                                    height={50}
                                    alt="song"
                                    className="rounded-full min-h-[50px] max-h-[50px] min-w-[50px] max-w-[50px]"
                                />
                            </div>
                            <div className="absolute left-[64px] bottom-[20px]">
                                <MusicBar />
                            </div>
                            <div
                                className="text-sm"
                                style={{
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    WebkitLineClamp: 1
                                }}>
                                {roomData?.currentSong?.name}
                            </div>
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
            </div>
            {session && (
                <JoinedUsers
                    jwt={session.backendTokens.jwt}
                    id={id}
                    isOwner={isOwner}
                    user={session.user}
                />
            )}
        </div>
    );
};
