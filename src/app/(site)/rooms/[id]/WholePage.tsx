'use client';

import { useSocket } from '@/Context/SocketProvider';
import { Session } from 'next-auth';
import { FC, useEffect, useState } from 'react';
import AudioRoom from './AudioRoom';
import { ChatComponent } from './chat-component';
import SearchComponent from './search-component';
import { BackButton } from '@/components/backButton';
import { Logo } from '@/components/logo';
import { User } from '../../header/user';
import { SongQueue } from './song-queue';
import { JoinedUsers } from './joined-users';
import { JoinedUsersMobile } from './joined-users-mobile';
import { IoIosArrowUp } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';

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

    const [showMobileUsers, setShowMobileUsers] = useState(false);
    const [showQueue, setShowQueue] = useState(false);

    return (
        <div className="flex justify-around h-full bg-gray-100 gap-4 ">
            <SongQueue />

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
                    {session?.backendTokens?.jwt && (
                        <SearchComponent
                            id={id}
                            jwt={session.backendTokens.jwt}
                            isOwner={isOwner}
                        />
                    )}
                </div>
                {session?.user && id && <ChatComponent user={session.user} roomId={id} />}
                <div
                    className="cursor-pointer flex m-5 p-3 rounded-md bg-gray-400 gap-3"
                    onClick={() => setShowQueue(true)}>
                    <IoIosArrowUp size={25} color={'white'} />
                    <span className="text-white">current song</span>
                </div>

                <div
                    className={`fixed bottom-0 left-0 w-full bg-white transition-transform duration-500  transform ${
                        showQueue ? 'translate-y-0' : 'translate-y-full'
                    }`}
                    style={{ height: 'calc(100vh - 86px)' }}>
                    <div
                        className="absolute top-[10px] left-[20px] cursor-pointer"
                        onClick={() => setShowQueue(false)}>
                        <IoClose size={40} />
                    </div>
                    <p className="p-4 text-center">Song queues</p>
                </div>

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
