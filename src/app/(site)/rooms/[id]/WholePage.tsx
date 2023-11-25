'use client';

import { useSocket } from '@/Context/SocketProvider';
import { Session } from 'next-auth';
import { FC, useEffect } from 'react';
// import AudioRoom from './AudioRoom';
import { ChatComponent } from './chat-component';
// import SearchComponent from './search-component';

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
        <>
            {/* {session?.backendTokens?.jwt && (
                <SearchComponent id={id} jwt={session.backendTokens.jwt} isOwner={isOwner} />
            )} */}
            {session?.user && id && <ChatComponent user={session.user} roomId={id} />}
            {/* {session?.backendTokens?.jwt && (
                <AudioRoom
                    jwt={session.backendTokens.jwt}
                    id={id}
                    isOwner={isOwner}
                    user={session?.user}
                />
            )} */}
        </>
    );
};
