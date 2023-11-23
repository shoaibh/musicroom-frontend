"use client";

import { useSocket } from "@/Context/SocketProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, FC, useCallback, useRef } from "react";
import { HiPaperAirplane } from "react-icons/hi2";
import MessageBox from "./message-box";

export const ChatComponent: FC<{
  user: {
    id: Number;
    name: string;
    email: string;
    image: string;
  };
  roomId: string;
}> = ({ user, roomId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{
      sender: {
        id: Number;
        name: string;
        email: string;
        image: string;
      };
      message: string;
      createdAt: number;
    }>
  >([]);

  const lastMessageRef = useCallback((node: any) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);

  const { socket, isConnected } = useSocket();

  useEffect(() => {
    // Load chat messages from Redis when the component mounts
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat-messages/${roomId}`)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      });
    if (!isConnected) return;
    // Listen for new messages from WebSocket
    socket.on("receive-message", (data: any) => {
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [roomId, isConnected, socket]);

  const sendMessage = useCallback(() => {
    const payload = {
      sender: { ...user },
      message,
      roomId,
      createdAt: Date.now(),
    };
    socket.emit("send-message", payload);
    setMessage("");
  }, [user, message, roomId, socket, setMessages]);

  return (
    <div className="max-h-[70vh] h-full overflow-scroll ">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto bg-white p-4 shadow-inner">
          {messages.map((msg, index) => {
            const lastMessage = messages.length - 1 === index;
            return (
              <div key={index} ref={lastMessage ? lastMessageRef : null}>
                <MessageBox
                  data={msg}
                  key={index}
                  isOwn={user.email === msg.sender.email}
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
        w-full border border-slate-200  border-solid rounded"
        >
          <Input
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="send a chat"
          />
          <Button onClick={sendMessage}>
            <HiPaperAirplane size={18} className="text-white" />
          </Button>
        </div>
      </div>{" "}
    </div>
  );
};
