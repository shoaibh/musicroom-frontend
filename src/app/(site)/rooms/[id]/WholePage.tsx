'use client';

import { useSocket } from '@/Context/SocketProvider';
import { Session } from 'next-auth';
import { FC, useEffect } from 'react';
import AudioRoom from './AudioRoom';
import { ChatComponent } from './chat-component';
import SearchComponent from './search-component';
import { BackButton } from '@/components/backButton';
import { Logo } from '@/components/logo';
import { User } from '../../header/user';
import { SongQueue } from './song-queue';
import { JoinedUsers } from './joined-users';

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

    return (
        <div className="flex justify-around h-full">
            <SongQueue />
            <div className="w-full h-full ">
                <div className="px-7 pt-7 pb-0">
                    <div className="flex justify-between w-full items-center pl-[20px] pr-[20px] ">
                        {/* <SearchBar /> */}
                        {/* <Notification /> */}
                        <BackButton />
                        <Logo />
                        {session?.user && <User user={session.user} />}
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
                {session?.backendTokens?.jwt && (
                    <AudioRoom
                        jwt={session.backendTokens.jwt}
                        id={id}
                        isOwner={isOwner}
                        user={session?.user}
                    />
                )}
            </div>
            <JoinedUsers />
        </div>
    );
};
