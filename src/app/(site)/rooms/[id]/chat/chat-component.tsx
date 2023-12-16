'use client';

import { useSocket } from '@/Context/SocketProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FC, useCallback, useEffect, useState } from 'react';
import { HiPaperAirplane } from 'react-icons/hi2';
import MessageBox from './message-box';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '@/app/libs/axios-config';

export const ChatComponent: FC<{
    user: {
        id: string;
        name: string;
        email: string;
        image: string;
    };
    roomId: string;
}> = ({ user, roomId }) => {
    const [message, setMessage] = useState('');

    // eslint-disable-next-line
    const lastMessageRef = useCallback((node: any) => {
        if (node) {
            node.scrollIntoView({ smooth: true });
        }
    }, []);

    const { socket, isConnected } = useSocket();

    const { data: messages } = useQuery({
        queryKey: ['messages', roomId],
        queryFn: () => axios.get(`/chat-messages/${roomId}`),
        enabled: !!roomId
    });

    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isConnected) return;
        if (!socket) return;
        // Listen for new messages from WebSocket
        // eslint-disable-next-line
        socket.on('receive-message', (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
        });

        return () => {
            socket.off('receive-message');
        };
    }, [roomId, isConnected, socket]);

    const sendMessage = useCallback(() => {
        if (!socket) return;

        const payload = {
            sender: user.id,
            message,
            roomId,
            createdAt: Date.now()
        };
        socket.emit('send-message', payload);
        setMessage('');
    }, [user, message, roomId, socket]);

    return (
        <div className="overflow-scroll flex-1">
            <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto bg-white p-4 shadow-inner">
                    {messages?.data?.map((msg: any, index: any) => {
                        const lastMessage = messages?.data.length - 1 === index;
                        return (
                            <div key={index} ref={lastMessage ? lastMessageRef : null}>
                                <MessageBox
                                    data={msg}
                                    key={index}
                                    isOwn={user.id === msg.sender._id}
                                />
                            </div>
                        );
                    })}
                </div>
                <div
                    className="py-4 
        px-4 
        bg-white 
        border-t 
        flex 
        items-center 
        gap-2 
        lg:gap-4 
        w-full border border-slate-200  border-solid rounded">
                    <Input
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                sendMessage();
                            }
                        }}
                        placeholder="send a chat"
                    />
                    <Button onClick={sendMessage}>
                        <HiPaperAirplane size={18} className="text-white" />
                    </Button>
                </div>
            </div>{' '}
        </div>
    );
};
